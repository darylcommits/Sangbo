import { useState, useRef, useEffect } from 'react'
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline'

const AIWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your SANGBO BERDE assistant. I can help answer questions about our waste management system, features, and services. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (question) => {
    const lowerQuestion = question.toLowerCase().trim()

    // Enhanced knowledge base with semantic understanding
    const knowledgeBase = [
      {
        keywords: ['what is', 'what are you', 'tell me about', 'introduce', 'sangbo berde', 'system'],
        response: "SANGBO BERDE is an innovative waste management system that transforms waste into wealth through sustainable composting. We combine workforce management, mobile alerts, community reporting, and data analytics to create efficient waste collection and processing operations."
      },
      {
        keywords: ['features', 'capabilities', 'what can you do', 'what do you offer', 'services'],
        response: "Our system includes: 1) Workforce Management - digital scheduling and attendance tracking, 2) Mobile Response Alerts - real-time notifications for routes and issues, 3) Community Reporting - citizen portal for waste complaints, and 4) Data Dashboard - analytics for performance monitoring."
      },
      {
        keywords: ['workforce', 'staff', 'employee', 'team', 'workers', 'management'],
        response: "Our workforce management features include GPS-based attendance tracking, QR code check-in/check-out, real-time task assignments, and performance analytics. Staff can use mobile apps for route navigation and task completion."
      },
      {
        keywords: ['mobile', 'alert', 'notification', 'phone', 'app', 'response'],
        response: "The mobile response system provides real-time notifications for route updates, facility load monitoring, environmental alerts, and emergency notifications. Staff receive instant updates about their assignments and any urgent community issues."
      },
      {
        keywords: ['community', 'citizen', 'reporting', 'complaint', 'issue', 'portal'],
        response: "Citizens can use our community reporting portal to submit waste collection issues, improper disposal complaints, or facility concerns. Reports include photo documentation, GPS location tracking, and status updates."
      },
      {
        keywords: ['dashboard', 'analytics', 'data', 'report', 'performance', 'monitor'],
        response: "The data dashboard provides HR officers and facility managers with real-time analytics, performance metrics, efficiency reports, and trend analysis. It helps monitor staff performance, collection efficiency, and compost output."
      },
      {
        keywords: ['compost', 'sustainable', 'environment', 'green', 'eco', 'waste diversion'],
        response: "We focus on waste diversion from landfills through efficient composting. Our system produces high-quality compost for agricultural use while reducing carbon footprint and optimizing collection routes."
      },
      {
        keywords: ['contact', 'reach', 'support', 'help', 'email', 'phone', 'office'],
        response: "You can reach us at: Email: info@sangboberde.com, Phone: +63 993-819-0512, or visit our office at Plaza Maestro Commercial Complex, Vigan City, Ilocos Sur."
      },
      {
        keywords: ['cost', 'price', 'pricing', 'fee', 'charge', 'budget', 'expensive'],
        response: "Our pricing depends on the size of your city and specific requirements. We offer customized solutions starting from basic implementations to comprehensive city-wide systems. Contact us for a detailed quote tailored to your needs."
      },
      {
        keywords: ['start', 'begin', 'get started', 'implementation', 'setup', 'onboard'],
        response: "To get started with SANGBO BERDE, contact our team for a consultation. We'll assess your needs, provide a customized implementation plan, and guide you through the setup process. Visit our authentication page to create your account."
      },
      {
        keywords: ['training', 'learn', 'teach', 'education', 'course', 'tutorial'],
        response: "We provide comprehensive training programs for all user roles including administrators, supervisors, field staff, and citizens. Training includes system usage, best practices, and ongoing support to ensure successful implementation."
      },
      {
        keywords: ['benefit', 'advantage', 'why choose', 'why use', 'value'],
        response: "SANGBO BERDE offers numerous benefits: reduced operational costs, improved efficiency, better community engagement, sustainable waste practices, real-time monitoring, and comprehensive reporting. Our system helps cities achieve their waste management goals effectively."
      },
      {
        keywords: ['qr', 'code', 'attendance', 'check', 'tracking'],
        response: "Our QR code attendance system allows for seamless check-in/check-out processes. Staff can scan QR codes at designated locations for accurate time tracking and location verification."
      },
      {
        keywords: ['gps', 'location', 'tracking', 'route', 'navigation'],
        response: "GPS tracking enables real-time location monitoring of waste collection vehicles and staff. This ensures efficient route optimization, accurate attendance verification, and improved operational oversight."
      }
    ]

    // Greeting responses
    if (lowerQuestion.match(/\b(hello|hi|hey|greetings|good morning|good afternoon|good evening)\b/)) {
      return "Hello! Welcome to SANGBO BERDE. How can I help you learn more about our waste management system?"
    }

    // Gratitude responses
    if (lowerQuestion.match(/\b(thank you|thanks|appreciate|grateful)\b/)) {
      return "You're welcome! I'm here to help you understand how SANGBO BERDE can transform your waste management operations. Feel free to ask me anything else!"
    }

    // Question detection and semantic matching
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'do', 'does', 'is', 'are', 'will', 'would', 'could', 'should']

    // Check if it's a question
    const isQuestion = questionWords.some(word => lowerQuestion.includes(word)) ||
                      lowerQuestion.endsWith('?') ||
                      lowerQuestion.startsWith('tell me') ||
                      lowerQuestion.startsWith('explain')

    // Find best matching response based on keyword similarity
    let bestMatch = null
    let highestScore = 0

    for (const item of knowledgeBase) {
      let score = 0
      const questionWords = lowerQuestion.split(/\s+/)

      for (const keyword of item.keywords) {
        // Exact keyword match gets higher score
        if (lowerQuestion.includes(keyword)) {
          score += 3
        }

        // Partial word matches
        for (const word of questionWords) {
          if (word.length > 2 && keyword.includes(word)) {
            score += 2
          }
          if (word.length > 2 && word.includes(keyword)) {
            score += 1
          }
        }
      }

      if (score > highestScore) {
        highestScore = score
        bestMatch = item
      }
    }

    // Return best match if score is above threshold
    if (bestMatch && highestScore >= 2) {
      return bestMatch.response
    }

    // Contextual responses based on conversation patterns
    if (lowerQuestion.includes('more') || lowerQuestion.includes('detail') || lowerQuestion.includes('explain')) {
      return "I'd be happy to provide more details! Could you specify which aspect of SANGBO BERDE you'd like me to elaborate on? I can explain our workforce management, mobile alerts, community reporting, or analytics features in more detail."
    }

    if (lowerQuestion.includes('demo') || lowerQuestion.includes('show') || lowerQuestion.includes('see')) {
      return "While I can't show you a live demo here, I can describe how our system works. Would you like me to walk you through a typical workflow, such as how waste collection is managed or how community reports are processed?"
    }

    // Intelligent fallback responses
    const intelligentFallbacks = [
      "That's an interesting question about SANGBO BERDE! While I might not have the exact details you're looking for, I can tell you about our core features: workforce management, mobile alerts, community reporting, and data analytics. What specific aspect interests you most?",
      "I'd love to help you with that! As SANGBO BERDE's AI assistant, I specialize in information about our waste management system. Could you rephrase your question or tell me more about what you're trying to learn?",
      "Great question! I'm designed to help you understand how SANGBO BERDE transforms waste management. I can provide detailed information about our technology, features, benefits, and implementation process. What would you like to know more about?",
      "I'm here to assist you with information about SANGBO BERDE's comprehensive waste management solution. While I don't have that specific detail, I can share insights about our workforce management, mobile response system, community engagement tools, and performance analytics. How can I help you today?"
    ]

    return intelligentFallbacks[Math.floor(Math.random() * intelligentFallbacks.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: generateResponse(inputValue),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000) // Random delay between 1-3 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6 group-hover:animate-pulse" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-[500px] flex flex-col animate-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">SANGBO BERDE Assistant</h3>
                <p className="text-sm text-green-100">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors duration-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about SANGBO BERDE..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors duration-200"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIWidget
