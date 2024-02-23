import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Markdown from 'react-markdown';


interface ConversationPair {
  question: string;
  answer: string;
}

export const Chat: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<ConversationPair[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { resourceId } = useParams<{ resourceId: string }>();

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    setIsLoading(true);
    // Update conversation history with the new question
    setConversationHistory([...conversationHistory, { question: currentMessage, answer: '' }]);
    setCurrentMessage('');

    try {
      const botResponse = await sendMessageToAPI(currentMessage, conversationHistory, resourceId as string);
      // Update the last conversation pair with the bot's response
      setConversationHistory(prev => [...prev.slice(0, -1), { ...prev[prev.length - 1], answer: botResponse }]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  async function sendMessageToAPI(question: string, history: ConversationPair[], resourceId: string): Promise<string> {
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
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto p-4 space-y-2">
        {conversationHistory.map((conv, index) => (
          <React.Fragment key={index}>
            
            <div className="max-w-xs mx-4 my-1 p-2 rounded bg-blue-500 text-white self-end">
              {conv.question}
            </div>
            {conv.answer && (
              <div className="max-w-xs mx-4 my-1 p-2 rounded bg-gray-200 self-start prose">
                <Markdown>
                {conv.answer}
                </Markdown>
              </div>
            )}
          </React.Fragment>
        ))}
        {isLoading && <div className="text-center">Loading...</div>}
      </div>
      <div className="p-4">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="w-full mt-2 bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};
