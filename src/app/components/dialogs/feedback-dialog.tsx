'use client'

import { notifySlack } from '@/app/actions/notifySlack'
import { FaceFrownIcon, FaceSmileIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '../button'
import Notification from '../notification'
import { Dialog, DialogBody, DialogTitle } from './dialog'

type Mood = 'happy' | 'neutral' | 'sad'

interface FeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function FeedbackDialog({ isOpen, onClose }: FeedbackDialogProps) {
  const session = useSession()
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const handleSubmit = async () => {
    setIsSubmitting(true)
    const moodEmoji = selectedMood
      ? {
          happy: '😊',
          neutral: '😐',
          sad: '😞',
        }[selectedMood]
      : ''

    try {
      await notifySlack(
        `New Feedback from ${session.data?.user?.name || 'no-name'} (${session.data?.user?.email || 'No email provided'}):\nMood: ${moodEmoji ? moodEmoji : 'No mood selected'}\nFeedback: ${feedback || 'No feedback provided'}`,
        'errors'
      )
      setFeedbackSent(true)
      onClose()
    } catch (error) {
      console.error('Failed to send feedback:', error)
    } finally {
      setIsSubmitting(false)
      setSelectedMood(null)
      setFeedback('')
    }
  }

  return (
    <div>
      {feedbackSent && (
        <Notification title="Thanks for your feedback!" status="success" onClose={() => setFeedbackSent(false)} />
      )}

      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Leave feedback</DialogTitle>
        <DialogBody>
          <div className="space-y-4">
            Hey! I&apos;d love to hear what went well and how I can improve the product experience.
            <div className="flex justify-center gap-4 py-2 pt-4">
              {[
                { mood: 'happy' as const, icon: FaceSmileIcon },
                { mood: 'sad' as const, icon: FaceFrownIcon },
              ].map(({ mood, icon: Icon }) => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`rounded-full p-2 transition-colors ${
                    selectedMood === mood
                      ? mood === 'sad'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                  }`}
                >
                  <Icon className="h-8 w-8" />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Ideas to improve this wand.email..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={4}
            />
          </div>
        </DialogBody>

        <div className="flex justify-between gap-2">
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <span>Need help?</span>
            <a href="mailto:support@wand.email" className="text-blue-600 hover:text-blue-700 hover:underline">
              Email support.
            </a>
          </div>
          <div className="flex justify-end gap-2 px-5 pb-4 pt-3">
            <Button plain onClick={onClose}>
              Cancel
            </Button>
            <Button color="purple" onClick={handleSubmit} disabled={(!selectedMood && !feedback) || isSubmitting}>
              Submit
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
