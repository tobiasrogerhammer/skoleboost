import { Home, User, Calendar, TrendingUp, Gift, Users, CheckCircle, Heart, MessageCircle, Camera } from 'lucide-react';

export default function UserJourneyMap() {
  const journeys = [
    {
      title: "Daily Check-In Journey",
      persona: "Alex - Regular Student",
      goal: "Check attendance points and progress",
      color: "bg-blue-500",
      steps: [
        {
          stage: "Awareness",
          action: "Morning routine - wants to check points",
          page: "Home",
          icon: Home,
          emotion: "😊 Curious",
          touchpoint: "App notification or habit",
        },
        {
          stage: "Exploration",
          action: "Views points balance and recent earnings",
          page: "Home",
          icon: TrendingUp,
          emotion: "😃 Excited",
          touchpoint: "Points display card",
        },
        {
          stage: "Engagement",
          action: "Checks schedule to see today's classes",
          page: "Schedule",
          icon: Calendar,
          emotion: "😌 Motivated",
          touchpoint: "Bottom navigation to schedule",
        },
        {
          stage: "Satisfaction",
          action: "Views achievements and stats",
          page: "Profile",
          icon: User,
          emotion: "😄 Proud",
          touchpoint: "Achievement badges",
        },
      ],
    },
    {
      title: "Coupon Redemption Journey",
      persona: "Maria - Lunch Enthusiast",
      goal: "Redeem points for a free pizza coupon",
      color: "bg-purple-500",
      steps: [
        {
          stage: "Motivation",
          action: "Saved up enough points for favorite item",
          page: "Home",
          icon: Gift,
          emotion: "🤩 Eager",
          touchpoint: "Sees pizza coupon in cafeteria section",
        },
        {
          stage: "Decision",
          action: "Checks if points are sufficient",
          page: "Home",
          icon: TrendingUp,
          emotion: "🤔 Calculating",
          touchpoint: "Points balance vs coupon cost",
        },
        {
          stage: "Action",
          action: "Redeems coupon with points",
          page: "Home",
          icon: CheckCircle,
          emotion: "🎉 Thrilled",
          touchpoint: "Redeem button",
        },
        {
          stage: "Fulfillment",
          action: "Shows coupon code at cafeteria",
          page: "Profile",
          icon: Gift,
          emotion: "😋 Happy",
          touchpoint: "My coupons section",
        },
      ],
    },
    {
      title: "Social Event Discovery Journey",
      persona: "Jordan - Social Butterfly",
      goal: "Find and register for a fun field trip",
      color: "bg-green-500",
      steps: [
        {
          stage: "Discovery",
          action: "Browses social events section",
          page: "Home",
          icon: Users,
          emotion: "👀 Browsing",
          touchpoint: "Social events card on home",
        },
        {
          stage: "Exploration",
          action: "Views detailed event list on schedule",
          page: "Schedule",
          icon: Calendar,
          emotion: "😍 Interested",
          touchpoint: "Social events tab",
        },
        {
          stage: "Engagement",
          action: "Registers for museum field trip",
          page: "Schedule",
          icon: CheckCircle,
          emotion: "🤗 Committed",
          touchpoint: "Register button",
        },
        {
          stage: "Community",
          action: "Adds comment about excitement",
          page: "Schedule",
          icon: MessageCircle,
          emotion: "💬 Social",
          touchpoint: "Event comments section",
        },
        {
          stage: "Participation",
          action: "Attends event and shares photos",
          page: "Schedule",
          icon: Camera,
          emotion: "📸 Creating memories",
          touchpoint: "Photo sharing feature",
        },
        {
          stage: "Recognition",
          action: "Views event participation on profile",
          page: "Profile",
          icon: Heart,
          emotion: "😊 Accomplished",
          touchpoint: "Event participation section",
        },
      ],
    },
  ];

  const emotionScale = [
    { label: "Frustrated", emoji: "😤", position: 1 },
    { label: "Neutral", emoji: "😐", position: 2 },
    { label: "Satisfied", emoji: "😊", position: 3 },
    { label: "Delighted", emoji: "🤩", position: 4 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-black mb-3">Student Engagement App</h1>
          <h2 className="text-gray-600 mb-4">User Journey Map</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Visualizing how students interact with the points system, coupons, and social events
            to build a thriving school community
          </p>
        </div>

        {/* App Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-black mb-4">App Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-black">Home Page</h4>
              </div>
              <ul className="space-y-1 text-gray-600">
                <li>• Points & Progress</li>
                <li>• Cafeteria Coupons</li>
                <li>• Social Events Preview</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-black">Schedule Page</h4>
              </div>
              <ul className="space-y-1 text-gray-600">
                <li>• Class Schedule</li>
                <li>• Points per Class</li>
                <li>• Social Events & Trips</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-black">Profile Page</h4>
              </div>
              <ul className="space-y-1 text-gray-600">
                <li>• Student Stats</li>
                <li>• Achievements</li>
                <li>• Event Participation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Journey Maps */}
        {journeys.map((journey, journeyIndex) => (
          <div key={journeyIndex} className="mb-12">
            {/* Journey Header */}
            <div className={`${journey.color} text-white rounded-2xl p-6 mb-6 shadow-lg`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-white mb-2">{journey.title}</h3>
                  <p className="opacity-90">
                    <span>Persona: {journey.persona}</span>
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-3 md:text-right">
                  <div className="opacity-90 text-white mb-1">Goal</div>
                  <div className="text-white">{journey.goal}</div>
                </div>
              </div>
            </div>

            {/* Journey Steps */}
            <div className="relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 z-0" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {journey.steps.map((step, stepIndex) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={stepIndex} className="relative">
                      {/* Mobile Connection Line */}
                      {stepIndex < journey.steps.length - 1 && (
                        <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 w-1 h-6 bg-gray-300" />
                      )}
                      
                      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-gray-300 transition-all hover:shadow-xl">
                        {/* Step Number */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${journey.color} rounded-full flex items-center justify-center`}>
                            <span className="text-white">{stepIndex + 1}</span>
                          </div>
                          <div className="text-gray-400">
                            {step.emotion}
                          </div>
                        </div>

                        {/* Stage */}
                        <div className="mb-3">
                          <div className="inline-block bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                            {step.stage}
                          </div>
                        </div>

                        {/* Action */}
                        <h4 className="text-black mb-4">{step.action}</h4>

                        {/* Touchpoint */}
                        <div className="bg-gray-50 rounded-xl p-3 mb-3">
                          <div className="text-gray-500 mb-1">Touchpoint</div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <IconComponent className="w-4 h-4" />
                            <span>{step.touchpoint}</span>
                          </div>
                        </div>

                        {/* Page */}
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-2 h-2 bg-gray-400 rounded-full" />
                          <span>{step.page} Page</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emotional Journey Graph */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h4 className="text-black mb-4">Emotional Journey</h4>
              <div className="relative h-32 bg-gray-50 rounded-xl p-4">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-gray-400 py-4">
                  {[...emotionScale].reverse().map((level) => (
                    <div key={level.position} className="flex items-center">
                      <span>{level.emoji}</span>
                    </div>
                  ))}
                </div>
                <div className="ml-12 h-full relative">
                  <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path
                      d={`M 0 ${100 - (journey.steps[0]?.emotion.includes('Curious') ? 60 : 50)} ${journey.steps.map((step, i) => {
                        const x = ((i + 1) / journey.steps.length) * 1000;
                        let y = 50;
                        if (step.emotion.includes('Excited') || step.emotion.includes('Thrilled') || step.emotion.includes('Delighted')) y = 90;
                        else if (step.emotion.includes('Happy') || step.emotion.includes('Proud') || step.emotion.includes('Accomplished')) y = 85;
                        else if (step.emotion.includes('Motivated') || step.emotion.includes('Eager') || step.emotion.includes('Interested')) y = 70;
                        else if (step.emotion.includes('Curious') || step.emotion.includes('Browsing') || step.emotion.includes('Calculating')) y = 60;
                        else if (step.emotion.includes('Social') || step.emotion.includes('Committed')) y = 75;
                        else if (step.emotion.includes('Creating')) y = 80;
                        return `L ${x} ${100 - y}`;
                      }).join(' ')}`}
                      fill="none"
                      stroke={journey.color.replace('bg-', '#').replace('500', '').replace('blue', '3b82f6').replace('purple', 'a855f7').replace('green', '22c55e')}
                      strokeWidth="3"
                      className="drop-shadow-sm"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-8 shadow-xl">
          <h3 className="text-white mb-6">Key Insights & Opportunities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-5">
              <h4 className="text-white mb-3">✅ Strengths</h4>
              <ul className="space-y-2 text-white/90">
                <li>• Clear gamification drives daily engagement</li>
                <li>• Multiple touchpoints keep students motivated</li>
                <li>• Social features build community connections</li>
                <li>• Tangible rewards (coupons) provide real value</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-5">
              <h4 className="text-white mb-3">💡 Opportunities</h4>
              <ul className="space-y-2 text-white/90">
                <li>• Push notifications for event reminders</li>
                <li>• Friend leaderboards for social competition</li>
                <li>• Highlight popular events on home page</li>
                <li>• Share achievements to social media</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pain Points & Solutions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <h4 className="text-black mb-4">🚧 Potential Pain Points</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <div className="text-gray-900">Points anxiety</div>
                  <div className="text-gray-600">Students may feel stressed about earning enough</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <div className="text-gray-900">Event capacity</div>
                  <div className="text-gray-600">Popular events fill up quickly</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 mt-1">•</span>
                <div>
                  <div className="text-gray-900">FOMO</div>
                  <div className="text-gray-600">Fear of missing out on social activities</div>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
            <h4 className="text-black mb-4">✨ Solutions</h4>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-green-500 mt-1">•</span>
                <div>
                  <div className="text-gray-900">Balanced rewards</div>
                  <div className="text-gray-600">Mix of free and points-based options</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 mt-1">•</span>
                <div>
                  <div className="text-gray-900">Waitlist feature</div>
                  <div className="text-gray-600">Get notified if spots open up</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 mt-1">•</span>
                <div>
                  <div className="text-gray-900">Event variety</div>
                  <div className="text-gray-600">Regular rotation of diverse activities</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
