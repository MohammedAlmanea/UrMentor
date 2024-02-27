import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from '../../theme/css';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface ConversationPair {
  question: string;
  answer: string;
}

export const Chat: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<
    ConversationPair[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { resourceId } = useParams<{ resourceId: string }>();
  const theme = useTheme();

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    setIsLoading(true);
    // Update conversation history with the new question
    setConversationHistory([
      ...conversationHistory,
      { question: currentMessage, answer: '' },
    ]);
    setCurrentMessage('');

    try {
      const botResponse = await sendMessageToAPI(
        currentMessage,
        conversationHistory,
        resourceId as string
      );
      // Update the last conversation pair with the bot's response
      setConversationHistory((prev) => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], answer: botResponse },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  async function sendMessageToAPI(
    question: string,
    history: ConversationPair[],
    resourceId: string
  ): Promise<string> {
    const apiUrl = `http://localhost:5600/api/chat/${resourceId}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        history,
      }),
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const data = await response.json();
    return data.text;
  }

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.6),
          imgUrl: '/background/overlay_2.jpg',
        }),
        paddingTop: 15,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // height: 1,
        minHeight: '100vh',
      }}
      display={'flex'}
      justifyContent={'center'}

      // height={}
    >
      <Box
        alignItems="center"
        justifyContent="center"
        width={{
          md: 1200,
          sm: 700,
          xs: 500,
        }}
        maxHeight={700}
        sx={{
          boxShadow: 24,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          p: { xs: 2, sm: 4, md: 8 },
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            boxShadow: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            p: { xs: 2, sm: 4, md: 8, lg: 2 },
            borderRadius: 2,
            overflow: 'auto',
          }}
          height={500}
        >
          <Box
            sx={{
              width: 1,
              display: 'flex',
              justifyContent: 'start',
            }}
          >
            <Box
              className="max-w-xs mx-4 my-1 p-2 rounded bg-gray-200 flex flex-col prose"
              sx={{
                p: 1,
                fontSize: 20,
                m: 2,
              }}
            >
              <Typography fontWeight={'bold'}>
                🌟 Welcome to UrMentor! 🌟
              </Typography>
              <Typography>
                I'm here to support you. Ask any question about the resource.
              </Typography>
            </Box>
          </Box>
          {conversationHistory.map((conv, index) => (
            <React.Fragment key={index}>
              <Box
                sx={{
                  width: 1,
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <Box
                  className="max-w-xs mx-4 my-1 p-2 rounded bg-blue-500 text-white self-start"
                  sx={{
                    p: 1,
                    fontSize: 20,
                    m: 2,
                  }}
                >
                  {conv.question}
                </Box>
              </Box>
              {conv.answer && (
                <Box
                  sx={{
                    width: 1,
                    display: 'flex',
                    justifyContent: 'start',
                  }}
                >
                  <Box
                    className="max-w-xs mx-4 my-1 p-2 rounded bg-gray-200 flex prose"
                    sx={{
                      p: 1,
                      fontSize: 20,
                      m: 2,
                    }}
                  >
                    <Markdown>{conv.answer}</Markdown>
                  </Box>
                </Box>
              )}
            </React.Fragment>
          ))}
          {isLoading && (
            <Box
              display={'flex'}
              width={1}
              justifyContent={'center'}
              alignContent={'center'}
              p={1}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
        <div className="p-4">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="w-full mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Send
          </button>
        </div>
      </Box>
    </Box>
  );
};
