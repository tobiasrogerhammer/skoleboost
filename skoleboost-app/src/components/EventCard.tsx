import React, { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Clock, MapPin, Users, UserPlus, UserMinus, MessageCircle, Send, Trash2, ChevronRight } from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Id } from '../../convex/_generated/dataModel'

interface EventCardProps {
  event: {
    _id: string | Id<'scheduleItems'> | Id<'socialEvents'>
    title?: string
    subject?: string
    description?: string
    date?: string
    day?: string
    time: string
    room?: string
    emoji?: string
    colorTheme?: string
    capacity?: number
    registered?: number
    isRegistered?: boolean
  }
  eventType: 'scheduleItem' | 'socialEvent'
  onRSVP?: (eventId: string) => void
  registeredEvents?: Set<string>
}

const getEventStyles = (colorTheme?: string) => {
  switch (colorTheme) {
    case 'blue':
      return { bg: 'linear-gradient(to bottom right, #00A7B3, #00C4D4, #00A7B3)', border: 'rgba(0, 167, 179, 0.5)' }
    case 'green':
      return { bg: 'linear-gradient(to bottom right, #4ECDC4, #44A08D, #4ECDC4)', border: 'rgba(78, 205, 196, 0.5)' }
    case 'pink':
      return { bg: 'linear-gradient(to bottom right, #FF6B9D, #FF8E9B, #FF6B9D)', border: 'rgba(255, 107, 157, 0.5)' }
    case 'purple':
      return { bg: 'linear-gradient(to bottom right, #E8A5FF, #C77DFF, #E8A5FF)', border: 'rgba(232, 165, 255, 0.5)' }
    case 'orange':
      return { bg: 'linear-gradient(to bottom right, #FBBE9E, #FF9F66, #FBBE9E)', border: 'rgba(251, 190, 158, 0.5)' }
    default:
      return { bg: 'linear-gradient(to bottom right, #00A7B3, #00C4D4, #00A7B3)', border: 'rgba(0, 167, 179, 0.5)' }
  }
}

const formatTimestamp = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'nå'
  if (minutes < 60) return `${minutes} min siden`
  if (hours < 24) return `${hours} timer siden`
  if (days < 7) return `${days} dager siden`
  return new Date(timestamp).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })
}

export const EventCard: React.FC<EventCardProps> = ({ event, eventType, onRSVP, registeredEvents }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newComment, setNewComment] = useState('')
  
  const eventId = event._id as Id<'scheduleItems'> | Id<'socialEvents'>
  const comments = useQuery(api.comments.getByEvent, { eventId })
  const addComment = useMutation(api.comments.add)
  const removeComment = useMutation(api.comments.remove)
  const currentUser = useQuery(api.users.getCurrentUser, {})

  const eventStyle = getEventStyles(event.colorTheme)
  const eventTitle = event.title || event.subject || 'Arrangement'
  const eventDate = event.date || event.day || ''
  
  // Determine if user is registered - check both string and Id formats
  const eventIdString = typeof event._id === 'string' ? event._id : event._id.toString()
  const isRegistered = registeredEvents?.has(eventIdString) || false
  // Use the registered count from the database (it's already updated by the mutation)
  // The event prop will be automatically updated when the query refetches
  const currentRegistered = event.registered || 0
  const isFull = event.capacity ? currentRegistered >= event.capacity : false
  const fillPercentage = event.capacity ? (currentRegistered / event.capacity) * 100 : 0

  const handleToggleRegistration = async () => {
    if (onRSVP) {
      // Send the eventId as string - it will be converted to Id type in the mutation
      await onRSVP(eventIdString)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    
    try {
      await addComment({
        eventId,
        message: newComment.trim(),
      })
      setNewComment('')
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: Id<'eventComments'>) => {
    try {
      await removeComment({ commentId })
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  return (
    <>
      <Card 
        className="p-4 border-2 cursor-pointer active:scale-[0.98] transition-all duration-300 hover:shadow-xl hover:scale-[1.01] group" 
        style={{ 
          background: eventStyle.bg, 
          borderColor: eventStyle.border,
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 167, 179, 0.15)'
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex items-center gap-3 flex-1">
          {event.emoji && (
            <span className="text-2xl flex-shrink-0">{event.emoji}</span>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-base drop-shadow-md line-clamp-1" style={{ color: 'white' }}>{eventTitle}</h4>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {eventDate && (
                <Badge className="text-xs bg-white/40 text-white border-white/50 backdrop-blur-md font-bold px-2 py-0.5">
                  {eventDate}
                </Badge>
              )}
              <span>{event.time}</span>
              {event.capacity && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{currentRegistered}/{event.capacity}</span>
                  </div>
                </>
              )}
              <span>•</span>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{comments?.length || 0}</span>
              </div>
            </div>
          </div>
          <ChevronRight 
            className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" 
            style={{ color: 'rgba(255, 255, 255, 0.9)' }}
          />
        </div>
      </Card>

      {/* Event Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto" style={{ borderRadius: '20px', width: '90vw', maxWidth: '90vw' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {event.emoji && <span className="text-xl">{event.emoji}</span>}
              {eventTitle}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Event Info */}
            <div className="p-4 border-2 rounded-lg" style={{ background: 'linear-gradient(to bottom right, #E8F6F6, white)', borderColor: 'rgba(0, 167, 179, 0.3)' }}>
              {event.description && (
                <p className="text-sm mb-3 font-medium" style={{ color: '#006C75' }}>{event.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm font-medium flex-wrap" style={{ color: 'rgba(0, 108, 117, 0.8)' }}>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{event.time}</span>
                </div>
                {event.room && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.room}</span>
                  </div>
                )}
                {eventDate && (
                  <div className="flex items-center gap-1">
                    <span>{eventDate}</span>
                  </div>
                )}
              </div>
              {event.capacity && (
                <div className="mt-3 text-sm">
                  <span className="font-medium" style={{ color: '#006C75' }}>Kapasitet: </span>
                  <span className="font-bold text-lg" style={{ color: isFull ? '#FBBE9E' : '#00A7B3' }}>
                    {currentRegistered}/{event.capacity}
                  </span>
                </div>
              )}
            </div>

            {/* RSVP Section */}
            {event.capacity && (
              <div className="space-y-2">
                <Button
                  variant={isRegistered ? "outline" : "default"}
                  disabled={isFull && !isRegistered}
                  onClick={async (e) => {
                    e.stopPropagation()
                    await handleToggleRegistration()
                  }}
                  className={`w-full font-bold transition-all duration-200 text-sm py-2`}
                  style={isFull && !isRegistered ? {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)'
                  } : isRegistered ? {
                    backgroundColor: '#EF4444',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
                  } : {
                    backgroundColor: '#00A7B3',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0, 167, 179, 0.4)'
                  }}
                >
                  {isFull && !isRegistered ? (
                    '❌ Fullt'
                  ) : isRegistered ? (
                    <><UserMinus className="w-4 h-4 mr-2" />Meld av</>
                  ) : (
                    <><UserPlus className="w-4 h-4 mr-2" />Meld deg på!</>
                  )}
                </Button>
                
                {event.capacity && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold" style={{ color: '#006C75' }}>Påmelding</span>
                      <span className="text-xs font-bold" style={{ color: '#006C75' }}>{Math.round(fillPercentage)}%</span>
                    </div>
                    <div 
                      className="w-full bg-gray-200 rounded-full h-2 border"
                      style={{ 
                        borderColor: 'rgba(0, 108, 117, 0.3)',
                        borderWidth: '1px'
                      }}
                    >
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          background: isFull 
                            ? 'linear-gradient(90deg, #FF6B6B, #FF8E8E)' 
                            : 'linear-gradient(90deg, #00A7B3, #00C4D4)',
                          width: `${fillPercentage}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Comments Section */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2" style={{ color: '#006C75' }}>
                <MessageCircle className="w-4 h-4" />
                Kommentarer ({comments?.length || 0})
              </h4>
              
              <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
                {comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex gap-2">
                      <Avatar className="w-8 h-8 text-xs flex-shrink-0">
                        {comment.imageUrl && (
                          <AvatarImage src={comment.imageUrl} alt={comment.author} />
                        )}
                        <AvatarFallback style={{ backgroundColor: '#00A7B3', color: 'white' }}>
                          {comment.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-sm min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold" style={{ color: '#006C75' }}>{comment.author}</span>
                          <span className="text-xs" style={{ color: 'rgba(0, 108, 117, 0.6)' }}>
                            {formatTimestamp(comment.createdAt)}
                          </span>
                          {currentUser && comment.userId === currentUser._id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 ml-auto"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteComment(comment._id)
                              }}
                            >
                              <Trash2 className="w-3 h-3" style={{ color: '#EF4444' }} />
                            </Button>
                          )}
                        </div>
                        <p className="font-medium break-words" style={{ color: 'rgba(0, 108, 117, 0.9)' }}>{comment.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-center py-4" style={{ color: 'rgba(0, 108, 117, 0.6)' }}>
                    Ingen kommentarer ennå. Vær den første!
                  </p>
                )}
              </div>

              {/* Add Comment */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Legg til en kommentar..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleAddComment()
                    }
                  }}
                  className="flex-1 min-h-[60px] resize-none"
                />
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddComment()
                  }}
                  disabled={!newComment.trim()}
                  style={{ backgroundColor: '#00A7B3', color: 'white' }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

