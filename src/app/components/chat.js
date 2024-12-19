"use client";

import {
  Box,
  TextField,
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  CssBaseline,
  Stack,
} from "@mui/material";
import { useChat } from "ai/react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import { avatarImg } from "../../data/index";
import "@fontsource/roboto";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/chat",
    onError: (e) => {
      console.log(e);
    },
  });

  const [initialMessages, setInitialMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: "Welcome MEMECOINER, Ready to become a pro?",
    },
  ]);

  // Combine initialMessages with any new messages
  const combinedMessages = [...initialMessages, ...messages];

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          backgroundImage: 'url("https://cdn.discordapp.com/attachments/1312932606802792450/1319136914313445417/62a1a21e1db77f20aeb3459c_water-tile-final-compressed.png?ex=6764dd7c&is=67638bfc&hm=44408575e448c40f933a0081b02db8a47e9372c15d523f42516793adf5cdbb85&")',
          backgroundSize: "fill",
          backgroundPosition: "center",
          fontFamily: 'Roboto, sans-serif',
          color: "black",
        }}
      >
        <Container sx={{ flexGrow: 1, py: 3 }}>
          <Stack
            direction={"column"}
            spacing={2}
            flexGrow={1}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 2,
              boxShadow: 3,
              overflow: "hidden",
              height: "100%",
              maxHeight: "100%",
            }}
          >
            <Box sx={{ overflowY: "auto", px: 3, py: 2, flexGrow: 1, backgroundImage: 'url("https://cdn.discordapp.com/attachments/1318109419585671249/1318374907704512592/das-gigapixel-standard-scale-4_00x.png?ex=676217d0&is=6760c650&hm=210f426f9064ce0ec44df65d74be1e71a92b36dc134069605d1017f4fb2a0336&")', }}>
              {combinedMessages.map((message, index) => {
                const isUser = message.role === "user";
                return (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="flex-start"
                    justifyContent={isUser ? "flex-end" : "flex-start"}
                    sx={{
                      mb: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        backgroundImage: 'url("https://cdn.discordapp.com/attachments/1318109419585671249/1318374907704512592/das-gigapixel-standard-scale-4_00x.png?ex=676217d0&is=6760c650&hm=210f426f9064ce0ec44df65d74be1e71a92b36dc134069605d1017f4fb2a0336&")',
                      },
                    }}
                  >
                    {!isUser && (
                      <Avatar
                        alt="Assistant"
                        src={`/images/${avatarImg}`}
                        sx={{ marginRight: 2 }}
                      />
                    )}
                    <Box
                      color="black"
                      borderRadius={16}
                      p={2}
                      maxWidth="70%"
                      dangerouslySetInnerHTML={{
                        __html: marked(message.content),
                      }}
                    />
                    {isUser && (
                      <Avatar
                        alt="User"
                        src="/images/user-avatar.png"
                        sx={{ marginLeft: 2 }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>

            <Box
              sx={{
                borderTop: 0,
                borderColor: "divider",
                p: 2,
                display: "flex",
                alignItems: "center",
                backgroundImage: 'url("https://cdn.discordapp.com/attachments/1312932606802792450/1313713132161601596/Screenshot_2024-12-03_at_7.46.15_PM.png?ex=675b0572&is=6759b3f2&hm=522aebbab24bce446ee34f551ce9c07e42d98de7701f44309c3363389bb1e810&")',
              }}
            >
              <TextField
                label="Type your message"
                fullWidth
                value={input}
                onChange={handleInputChange}
                variant="outlined"
                sx={{
                  marginRight: 2,
                  backgroundImage: "grey.100",
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                }}
              />
              <IconButton color="red" onClick={handleSubmit}>
                <SendIcon />
              </IconButton>
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

