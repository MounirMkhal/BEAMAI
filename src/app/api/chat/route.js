import {
    Message as VercelChatMessage,
    StreamingTextResponse,
    createStreamDataTransformer
} from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import path from 'path'
import fs from 'fs'

const filePath = path.resolve(process.cwd(), './src/data/states.json')

if (!fs.existsSync(filePath)) {
    throw new Error('File not found: ' + filePath)
}

const loader = new JSONLoader(
    filePath,
    [
        "/services", 
    ]
);


export const dynamic = 'force-dynamic'

/**
 * Formats message into <role>: <content>
 */
const formatMessage = (message) => {
    return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are BEAM AI, an intuitive and beginner-friendly artificial intelligence designed to guide novice traders in the exciting yet volatile world of meme coins. Your mission is to educate, simplify complex crypto concepts, and provide actionable insights, enabling users to navigate the market with confidence and safety. Answer the user's questions with clarity, patience, and encouragement, ensuring they feel supported and informed at every step and you know about top memecoin traders in the space like Cupsey, Orangie, Euris, FrankdeGod, Ansem, etc... . Maintain an approachable and supportive tone while providing insightful, concise responses.
==============================
Context: {context}
==============================
Current conversation: {chat_history}

user: {question}
assistant:

`;


export async function POST(req) {
    try {
        // extract messages from body request
        const { messages } = await req.json();
        const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
        const currentMessageContent = messages[messages.length - 1].content;
        const docs = await loader.load();
        const prompt = PromptTemplate.fromTemplate(TEMPLATE);
        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            model: 'gpt-4o-mini',
            temperature: 0,
            streaming: true,
            verbose: true,
        });

        // output parser handles serialization and encoding of message chunks from chat model
        const parser = new HttpResponseOutputParser();

        const chain = RunnableSequence.from([
            {
                question: (input) => input.question,
                chat_history: (input) => input.chat_history,
                context: () => formatDocumentsAsString(docs),
            },
            prompt,
            model,
            parser,
        ]);

        // convert the response into a friendly text-stream
        const stream = await chain.stream({
            chat_history: formattedPreviousMessages.join('\n'),
            question: currentMessageContent,
        });

        // respond with the stream
        return new StreamingTextResponse(
            stream.pipeThrough(createStreamDataTransformer()),
        );
    } catch (e) {
        return Response.json({ error: e.message }, { status: e.status ?? 500 });
    }
}