import React, { useEffect, useState } from 'react';
import { Input, Button, Space, Typography } from 'antd';

const { Title, Paragraph } = Typography;

function ChatComponent() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; content: string }[]>(
    () => {
      const storedMessages = localStorage.getItem('chatMessages');
      return storedMessages ? JSON.parse(storedMessages) : [];
    }
  );

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    // 先将用户消息添加到消息列表
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', content: input },
    ]);
    try {
      const response = await fetch(`http://localhost:8102/api/ai/steamChat?input=${input}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let partialMessage = '';
      // 流式处理响应数据
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          partialMessage += chunk;
          // 每次接收到新数据时更新消息列表
          setMessages((prevMessages) => {
            const lastMessageIndex = prevMessages.length - 1;
            if (prevMessages[lastMessageIndex]?.sender === 'ai') {
              const newMessages = [...prevMessages];
              newMessages[lastMessageIndex].content = partialMessage;
              return newMessages;
            } else {
              return [...prevMessages, { sender: 'ai', content: partialMessage }];
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch', error);
    }
    setInput('');
  };

  const handleClearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={3}>Chat Room</Title>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '20px',
          maxHeight: '500px',
          overflowY: 'auto',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: message.sender === 'user' ? '#e6f7ff' : '#f5f5f5',
            }}
          >
            <Paragraph style={{ marginBottom: 0 }}>
              {message.sender === 'user' ? 'You: ' : 'AI: '}
              {message.content}
            </Paragraph>
          </div>
        ))}
      </div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your message"
        />
        <Space>
          <Button type="primary" onClick={handleSendMessage}>
            Send
          </Button>
          <Button onClick={handleClearMessages}>Clear</Button>
        </Space>
      </Space>
    </div>
  );
}

export default ChatComponent;
