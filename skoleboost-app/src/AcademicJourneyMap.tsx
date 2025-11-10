import { Home, User, Calendar, TrendingUp, Gift, Users, CheckCircle, Heart, MessageCircle, Camera, BookOpen, Target, Lightbulb, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

export default function AcademicJourneyMap() {
  const journeys = [
    {
      title: "Academic Engagement & Reward Pathway",
      persona: "Type A: Routine-Oriented Student (Alex)",
      demographics: "Age 13-15, Regular attendance pattern, Moderate digital engagement",
      goal: "Monitor academic progress and point accumulation",
      color: "bg-blue-600",
      borderColor: "border-blue-600",
      steps: [
        {
          stage: "Awareness",
          action: "Daily routine check-in behavior",
          page: "Home Dashboard",
          icon: Home,
          emotion: "Moderate Interest",
          emotionScore: 3,
          touchpoint: "Push notification / Habitual behavior",
          duration: "30-60 seconds",
          painPoints: ["Information overload", "Unclear navigation"],
          opportunities: ["Personalized greeting", "Quick stats summary"],
        },
        {
          stage: "Exploration",
          action: "Assessment of point balance and recent earnings",
          page: "Home Dashboard",
          icon: TrendingUp,
          emotion: "Elevated Interest",
          emotionScore: 4,
          touchpoint: "Points visualization component",
          duration: "45-90 seconds",
          painPoints: ["Comparison anxiety", "Unclear point value"],
          opportunities: ["Progress contextualization", "Achievement highlights"],
        },
        {
          stage: "Planning",
          action: "Review of daily class schedule and point opportunities",
          page: "Schedule View",
          icon: Calendar,
          emotion: "Motivated",
          emotionScore: 4,
          touchpoint: "Schedule interface with point indicators",
          duration: "60-120 seconds",
          painPoints: ["Schedule complexity", "Uncertainty about point values"],
          opportunities: ["Point prediction", "Attendance streaks"],
        },
        {
          stage: "Validation",
          action: "Review of achievements and comparative statistics",
          page: "Profile Dashboard",
          icon: User,
          emotion: "Satisfaction",
          emotionScore: 4,
          touchpoint: "Achievement badge system",
          duration: "90-180 seconds",
          painPoints: ["Social comparison stress", "Achievement fatigue"],
          opportunities: ["Personal growth metrics", "Social validation"],
        },
      ],
    },
    {
      title: "Transactional Reward Redemption Pathway",
      persona: "Type B: Goal-Oriented Student (Maria)",
      demographics: "Age 14-16, Strategic behavior pattern, High motivation for tangible rewards",
      goal: "Accumulate and exchange points for desired reward items",
      color: "bg-purple-600",
      borderColor: "border-purple-600",
      steps: [
        {
          stage: "Goal Formation",
          action: "Identification of desired reward item (cafeteria coupon)",
          page: "Home Dashboard",
          icon: Gift,
          emotion: "High Anticipation",
          emotionScore: 4,
          touchpoint: "Reward catalog interface",
          duration: "60-90 seconds",
          painPoints: ["Limited reward variety", "Unclear availability"],
          opportunities: ["Personalized recommendations", "Wishlist feature"],
        },
        {
          stage: "Evaluation",
          action: "Cost-benefit analysis of point expenditure",
          page: "Home Dashboard",
          icon: TrendingUp,
          emotion: "Deliberation",
          emotionScore: 3,
          touchpoint: "Point balance vs. cost comparison",
          duration: "30-60 seconds",
          painPoints: ["Opportunity cost uncertainty", "Future point anxiety"],
          opportunities: ["Point earning projections", "Cost transparency"],
        },
        {
          stage: "Transaction",
          action: "Point redemption for selected reward",
          page: "Home Dashboard",
          icon: CheckCircle,
          emotion: "Peak Satisfaction",
          emotionScore: 5,
          touchpoint: "Redemption confirmation interface",
          duration: "15-30 seconds",
          painPoints: ["Transaction anxiety", "Immediate regret possibility"],
          opportunities: ["Confirmation ritual", "Celebration feedback"],
        },
        {
          stage: "Utilization",
          action: "Physical redemption of digital reward",
          page: "Profile Dashboard",
          icon: Gift,
          emotion: "Fulfillment",
          emotionScore: 5,
          touchpoint: "Coupon display interface",
          duration: "Variable (external)",
          painPoints: ["Code readability", "Staff recognition issues"],
          opportunities: ["QR code integration", "Usage tracking"],
        },
      ],
    },
    {
      title: "Social Engagement & Community Building Pathway",
      persona: "Type C: Socially-Oriented Student (Jordan)",
      demographics: "Age 13-16, High social motivation, Active community participation",
      goal: "Discover, register, and participate in community events",
      color: "bg-green-600",
      borderColor: "border-green-600",
      steps: [
        {
          stage: "Discovery",
          action: "Browsing of available social events",
          page: "Home Dashboard",
          icon: Users,
          emotion: "Curiosity",
          emotionScore: 3,
          touchpoint: "Social events preview component",
          duration: "45-90 seconds",
          painPoints: ["Information density", "Unclear event value"],
          opportunities: ["Event highlighting", "Friend participation indicators"],
        },
        {
          stage: "Investigation",
          action: "Detailed examination of event characteristics",
          page: "Schedule View",
          icon: Calendar,
          emotion: "Interest",
          emotionScore: 4,
          touchpoint: "Event detail view",
          duration: "90-180 seconds",
          painPoints: ["Missing information", "Capacity anxiety"],
          opportunities: ["Comprehensive details", "Social proof"],
        },
        {
          stage: "Commitment",
          action: "Registration for selected event",
          page: "Schedule View",
          icon: CheckCircle,
          emotion: "Enthusiasm",
          emotionScore: 4,
          touchpoint: "Registration confirmation",
          duration: "30-60 seconds",
          painPoints: ["Registration friction", "Commitment anxiety"],
          opportunities: ["Streamlined process", "Calendar integration"],
        },
        {
          stage: "Social Interaction",
          action: "Pre-event community engagement (comments)",
          page: "Schedule View",
          icon: MessageCircle,
          emotion: "Social Connection",
          emotionScore: 4,
          touchpoint: "Comment interface",
          duration: "120-300 seconds",
          painPoints: ["Moderation concerns", "Limited interaction types"],
          opportunities: ["Rich interaction features", "Community building"],
        },
        {
          stage: "Participation",
          action: "Event attendance and content creation (photos)",
          page: "Schedule View",
          icon: Camera,
          emotion: "Peak Experience",
          emotionScore: 5,
          touchpoint: "Media sharing interface",
          duration: "Variable (during event)",
          painPoints: ["Photo quality concerns", "Privacy considerations"],
          opportunities: ["Event memories", "Social sharing"],
        },
        {
          stage: "Reflection",
          action: "Post-event review and participation tracking",
          page: "Profile Dashboard",
          icon: Heart,
          emotion: "Satisfaction & Identity",
          emotionScore: 4,
          touchpoint: "Participation history display",
          duration: "60-120 seconds",
          painPoints: ["Limited reflection prompts", "Missed recognition"],
          opportunities: ["Identity formation", "Community status"],
        },
      ],
    },
  ];

  const emotionLevels = [
    { level: 1, label: "Low Engagement", color: "bg-red-100" },
    { level: 2, label: "Moderate Disinterest", color: "bg-orange-100" },
    { level: 3, label: "Neutral/Moderate Interest", color: "bg-yellow-100" },
    { level: 4, label: "High Engagement", color: "bg-green-100" },
    { level: 5, label: "Peak Experience", color: "bg-blue-100" },
  ];

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Title Page */}
        <div className="text-center mb-16 pb-12 border-b-2 border-gray-300">
          <div className="mb-6">
            <BookOpen className="w-16 h-16 mx-auto text-gray-700 mb-4" />
          </div>
          <h1 className="text-black mb-4">
            User Journey Analysis: Gamified Educational Engagement System
          </h1>
          <h2 className="text-gray-700 mb-6">
            A Multi-Modal Investigation of Student Interaction Patterns in Digital Reward-Based Attendance Platforms
          </h2>
          <div className="text-gray-600 space-y-2 max-w-2xl mx-auto">
            <p><strong>Research Domain:</strong> Human-Computer Interaction, Educational Technology, Behavioral Design</p>
            <p><strong>Methodology:</strong> User Journey Mapping, Persona-Based Analysis, Touchpoint Evaluation</p>
            <p><strong>Date:</strong> November 2025</p>
          </div>
        </div>

        {/* Abstract */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">Abstract</h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            <p>
              This research presents a comprehensive user journey analysis of a mobile-first gamified educational platform 
              designed to improve student attendance and community engagement through a points-based reward system. The study 
              examines three distinct user pathways representing different student motivational profiles: academic engagement 
              (routine-oriented), transactional reward redemption (goal-oriented), and social community building (socially-oriented).
            </p>
            <p>
              Through systematic touchpoint analysis and emotional journey mapping, we identify critical interaction moments, 
              pain points, and opportunities for optimization. The platform integrates three core functional modules: (1) attendance 
              tracking with point accumulation, (2) reward redemption marketplace, and (3) social event management with community 
              features. Our analysis reveals distinct behavioral patterns across user types and provides evidence-based recommendations 
              for enhancing user experience and achieving educational objectives.
            </p>
          </div>
        </section>

        {/* Research Questions */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">Research Questions</h2>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 space-y-3">
            <div>
              <strong className="text-gray-900">RQ1:</strong>
              <span className="text-gray-700 ml-2">
                What are the primary interaction pathways students follow when engaging with the gamified attendance platform?
              </span>
            </div>
            <div>
              <strong className="text-gray-900">RQ2:</strong>
              <span className="text-gray-700 ml-2">
                How do different student personas (routine-oriented, goal-oriented, socially-oriented) differ in their 
                emotional journeys and touchpoint interactions?
              </span>
            </div>
            <div>
              <strong className="text-gray-900">RQ3:</strong>
              <span className="text-gray-700 ml-2">
                What are the critical pain points and opportunities for optimization at each stage of the user journey?
              </span>
            </div>
            <div>
              <strong className="text-gray-900">RQ4:</strong>
              <span className="text-gray-700 ml-2">
                How can the platform design better support both extrinsic motivation (rewards) and intrinsic motivation 
                (social connection, achievement) to sustain long-term engagement?
              </span>
            </div>
          </div>
        </section>

        {/* Methodology */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">Methodology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Database className="w-5 h-5" />
                  Data Collection
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <ul className="space-y-2">
                  <li>• <strong>Persona Development:</strong> Three archetypal user profiles based on motivational research</li>
                  <li>• <strong>Journey Mapping:</strong> Stage-by-stage interaction analysis</li>
                  <li>• <strong>Touchpoint Identification:</strong> Interface elements and interaction moments</li>
                  <li>• <strong>Emotional Assessment:</strong> 5-point engagement scale</li>
                  <li>• <strong>Time Analysis:</strong> Duration estimates per interaction stage</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Target className="w-5 h-5" />
                  Analytical Framework
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <ul className="space-y-2">
                  <li>• <strong>Theoretical Basis:</strong> Self-Determination Theory, Gamification Design</li>
                  <li>• <strong>Evaluation Metrics:</strong> Engagement level, pain points, opportunities</li>
                  <li>• <strong>User Segmentation:</strong> Behavioral pattern classification</li>
                  <li>• <strong>Experience Mapping:</strong> Multi-touchpoint pathway analysis</li>
                  <li>• <strong>Comparative Analysis:</strong> Cross-persona pattern identification</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* System Architecture */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">System Architecture Overview</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-5 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-black">Module 1: Home Dashboard</h4>
                </div>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Primary Functions:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Points balance visualization</li>
                    <li>Progress tracking interface</li>
                    <li>Reward catalog display</li>
                    <li>Social events preview</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-black">Module 2: Schedule View</h4>
                </div>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Primary Functions:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Class schedule display</li>
                    <li>Point earning opportunities</li>
                    <li>Social event listings</li>
                    <li>Event registration system</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg p-5 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-black">Module 3: Profile Dashboard</h4>
                </div>
                <div className="text-gray-600 space-y-2">
                  <p><strong>Primary Functions:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Student statistics display</li>
                    <li>Achievement badge system</li>
                    <li>Event participation history</li>
                    <li>Reward redemption record</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Journey Analysis */}
        <section className="mb-12">
          <h2 className="text-black mb-6 pb-2 border-b border-gray-300">Detailed User Journey Analysis</h2>
          
          {journeys.map((journey, journeyIndex) => (
            <div key={journeyIndex} className="mb-16">
              {/* Journey Header */}
              <div className={`${journey.color} text-white rounded-lg p-6 mb-6`}>
                <h3 className="text-white mb-3">
                  Journey {journeyIndex + 1}: {journey.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                  <div>
                    <div className="opacity-80 mb-1">Persona Profile</div>
                    <div>{journey.persona}</div>
                  </div>
                  <div>
                    <div className="opacity-80 mb-1">Demographics</div>
                    <div>{journey.demographics}</div>
                  </div>
                  <div>
                    <div className="opacity-80 mb-1">Primary Goal</div>
                    <div>{journey.goal}</div>
                  </div>
                </div>
              </div>

              {/* Journey Stages Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left text-gray-900">Stage</th>
                      <th className="border border-gray-300 p-3 text-left text-gray-900">Action</th>
                      <th className="border border-gray-300 p-3 text-left text-gray-900">Interface</th>
                      <th className="border border-gray-300 p-3 text-left text-gray-900">Touchpoint</th>
                      <th className="border border-gray-300 p-3 text-left text-gray-900">Duration</th>
                      <th className="border border-gray-300 p-3 text-left text-gray-900">Emotion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {journey.steps.map((step, stepIndex) => (
                      <tr key={stepIndex} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-3">
                          <strong className="text-gray-900">{stepIndex + 1}. {step.stage}</strong>
                        </td>
                        <td className="border border-gray-300 p-3 text-gray-700">{step.action}</td>
                        <td className="border border-gray-300 p-3 text-gray-700">{step.page}</td>
                        <td className="border border-gray-300 p-3 text-gray-700">{step.touchpoint}</td>
                        <td className="border border-gray-300 p-3 text-gray-700">{step.duration}</td>
                        <td className="border border-gray-300 p-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              step.emotionScore === 5 ? 'bg-blue-500' :
                              step.emotionScore === 4 ? 'bg-green-500' :
                              step.emotionScore === 3 ? 'bg-yellow-500' :
                              step.emotionScore === 2 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`} />
                            <span className="text-gray-700">{step.emotion}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pain Points & Opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-black">Identified Pain Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {journey.steps.map((step, stepIndex) => (
                        <div key={stepIndex}>
                          <div className="text-gray-900 mb-2">
                            <strong>Stage {stepIndex + 1}: {step.stage}</strong>
                          </div>
                          <ul className="space-y-1">
                            {step.painPoints.map((pain, painIndex) => (
                              <li key={painIndex} className="text-gray-700 flex items-start gap-2">
                                <span className="text-red-500 mt-1">▸</span>
                                <span>{pain}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-black">Design Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {journey.steps.map((step, stepIndex) => (
                        <div key={stepIndex}>
                          <div className="text-gray-900 mb-2">
                            <strong>Stage {stepIndex + 1}: {step.stage}</strong>
                          </div>
                          <ul className="space-y-1">
                            {step.opportunities.map((opp, oppIndex) => (
                              <li key={oppIndex} className="text-gray-700 flex items-start gap-2">
                                <span className="text-green-500 mt-1">▸</span>
                                <span>{opp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Emotional Journey Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Emotional Engagement Trajectory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 bg-gray-50 rounded-lg p-6">
                    <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-gray-600 py-6">
                      {[5, 4, 3, 2, 1].map((level) => (
                        <div key={level} className="flex items-center justify-end pr-2 text-gray-700">
                          <span>{level}</span>
                        </div>
                      ))}
                    </div>
                    <div className="ml-16 h-full relative border-l-2 border-b-2 border-gray-300">
                      <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`gradient-${journeyIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: journey.color.includes('blue') ? '#2563eb' : journey.color.includes('purple') ? '#9333ea' : '#16a34a', stopOpacity: 0.2 }} />
                            <stop offset="100%" style={{ stopColor: journey.color.includes('blue') ? '#2563eb' : journey.color.includes('purple') ? '#9333ea' : '#16a34a', stopOpacity: 0.5 }} />
                          </linearGradient>
                        </defs>
                        
                        {/* Area under curve */}
                        <path
                          d={`M 0 200 ${journey.steps.map((step, i) => {
                            const x = ((i + 1) / (journey.steps.length + 1)) * 1000;
                            const y = 200 - (step.emotionScore * 35);
                            return `L ${x} ${y}`;
                          }).join(' ')} L 1000 200 Z`}
                          fill={`url(#gradient-${journeyIndex})`}
                        />
                        
                        {/* Line */}
                        <path
                          d={`M 0 ${200 - (journey.steps[0]?.emotionScore * 35)} ${journey.steps.map((step, i) => {
                            const x = ((i + 1) / (journey.steps.length + 1)) * 1000;
                            const y = 200 - (step.emotionScore * 35);
                            return `L ${x} ${y}`;
                          }).join(' ')}`}
                          fill="none"
                          stroke={journey.color.includes('blue') ? '#2563eb' : journey.color.includes('purple') ? '#9333ea' : '#16a34a'}
                          strokeWidth="3"
                        />
                        
                        {/* Data points */}
                        {journey.steps.map((step, i) => {
                          const x = ((i + 1) / (journey.steps.length + 1)) * 1000;
                          const y = 200 - (step.emotionScore * 35);
                          return (
                            <circle
                              key={i}
                              cx={x}
                              cy={y}
                              r="6"
                              fill={journey.color.includes('blue') ? '#2563eb' : journey.color.includes('purple') ? '#9333ea' : '#16a34a'}
                              stroke="white"
                              strokeWidth="2"
                            />
                          );
                        })}
                      </svg>
                      
                      {/* Stage labels */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-around text-gray-600 -mb-8">
                        {journey.steps.map((step, i) => (
                          <div key={i} className="text-center" style={{ fontSize: '11px' }}>
                            <div className="text-gray-700">{step.stage}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-12 text-gray-600">
                    <strong className="text-gray-900">Note:</strong> Emotional engagement measured on a 5-point scale where 1 = Low Engagement and 5 = Peak Experience
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </section>

        {/* Comparative Analysis */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">Comparative Cross-Persona Analysis</h2>
          <Card>
            <CardContent className="p-6">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-3 text-left text-gray-900">Dimension</th>
                    <th className="border border-gray-300 p-3 text-left text-gray-900">Type A: Routine-Oriented</th>
                    <th className="border border-gray-300 p-3 text-left text-gray-900">Type B: Goal-Oriented</th>
                    <th className="border border-gray-300 p-3 text-left text-gray-900">Type C: Socially-Oriented</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>Journey Length</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">4 stages</td>
                    <td className="border border-gray-300 p-3 text-gray-700">4 stages</td>
                    <td className="border border-gray-300 p-3 text-gray-700">6 stages (longest)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>Primary Motivation</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">Academic progress tracking</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Tangible reward acquisition</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Social connection and belonging</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>Peak Engagement Point</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">Achievement validation (Stage 4)</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Transaction & utilization (Stages 3-4)</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Event participation (Stage 5)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>Average Session Duration</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">3.5-7 minutes</td>
                    <td className="border border-gray-300 p-3 text-gray-700">2.5-4.5 minutes</td>
                    <td className="border border-gray-300 p-3 text-gray-700">5-12 minutes</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>Critical Pain Point</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">Social comparison anxiety</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Future point uncertainty</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Event capacity limitations</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>Emotional Pattern</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">Steady moderate-to-high (3→4→4→4)</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Deliberation to peak (4→3→5→5)</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Gradual escalation (3→4→4→4→5→4)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>Primary Interface</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">Home & Profile dashboards</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Home dashboard (concentrated)</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Schedule view (extended use)</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* Key Findings */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">Key Findings</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Lightbulb className="w-5 h-5" />
                  Finding 1: Divergent Motivational Structures
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>
                  Analysis reveals three distinct motivational profiles among users, each requiring tailored design approaches. 
                  Routine-oriented students (Type A) demonstrate consistent moderate-to-high engagement focused on habit formation 
                  and progress validation. Goal-oriented students (Type B) exhibit strategic behavior with clear transactional focus, 
                  showing emotional peaks during reward acquisition. Socially-oriented students (Type C) display the longest engagement 
                  duration and highest emotional investment, particularly during community participation phases.
                </p>
                <p className="bg-blue-50 p-3 rounded border-l-4 border-blue-600">
                  <strong>Implication:</strong> Platform design should accommodate multiple motivational frameworks rather than assuming 
                  a single user archetype. Personalization features could dynamically emphasize different system components based on 
                  detected user behavior patterns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Lightbulb className="w-5 h-5" />
                  Finding 2: Critical Touchpoint Concentration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>
                  The Home Dashboard serves as a critical convergence point for all three user journeys, functioning as both 
                  initial entry point and central hub. However, each persona utilizes this interface differently: Type A users 
                  conduct rapid information scanning (30-90 seconds), Type B users engage in strategic evaluation (60-90 seconds), 
                  and Type C users use it as a discovery gateway before transitioning to Schedule View (45-90 seconds).
                </p>
                <p className="bg-blue-50 p-3 rounded border-l-4 border-blue-600">
                  <strong>Implication:</strong> Home Dashboard requires flexible information architecture that supports multiple 
                  use cases simultaneously. Consider adaptive layouts that prioritize different content based on user type detection 
                  or explicit preference settings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Lightbulb className="w-5 h-5" />
                  Finding 3: Anxiety-Inducing Design Elements
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>
                  Multiple pain points across all personas relate to anxiety-inducing features: social comparison stress (Type A), 
                  opportunity cost uncertainty (Type B), and event capacity limitations (Type C). These pain points occur during 
                  critical decision-making stages and potentially undermine the platform's engagement objectives. The gamification 
                  elements designed to motivate may inadvertently create psychological burden for certain users.
                </p>
                <p className="bg-blue-50 p-3 rounded border-l-4 border-blue-600">
                  <strong>Implication:</strong> Implement optional "healthy engagement" features such as: personal growth metrics 
                  instead of peer comparison, point earning projections to reduce uncertainty, and waitlist functionality for 
                  popular events. Consider providing users with control over competitive vs. collaborative framing of achievements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Lightbulb className="w-5 h-5" />
                  Finding 4: Extended Engagement in Social Pathway
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <p>
                  The socially-oriented journey (Type C) demonstrates significantly longer engagement duration (5-12 minutes vs. 
                  2.5-7 minutes for other types) and includes the only pathway with six distinct stages. This suggests that social 
                  features provide deeper, more sustained engagement compared to transactional or monitoring activities. The peak 
                  emotional experience occurs during active event participation rather than digital interaction, indicating the 
                  platform successfully bridges digital and physical community building.
                </p>
                <p className="bg-blue-50 p-3 rounded border-l-4 border-blue-600">
                  <strong>Implication:</strong> Social features represent a high-value engagement lever. Expanding community-building 
                  tools (comments, photo sharing, collaborative activities) may increase overall platform stickiness. Consider 
                  integrating social elements into other journeys (e.g., group challenges for Type A, collaborative reward goals for Type B).
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Design Recommendations */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">Evidence-Based Design Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-black">High Priority Interventions</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <div>
                  <strong className="text-gray-900">1. Personalized Home Dashboard</strong>
                  <p className="ml-4 mt-1">Implement adaptive layouts that prioritize content based on detected user behavior patterns. Reduce cognitive load by highlighting relevant information for each persona type.</p>
                </div>
                <div>
                  <strong className="text-gray-900">2. Anxiety Reduction Features</strong>
                  <p className="ml-4 mt-1">Add optional personal growth metrics, point earning projections, and privacy controls for social comparison features. Enable users to customize competitive vs. collaborative displays.</p>
                </div>
                <div>
                  <strong className="text-gray-900">3. Event Capacity Management</strong>
                  <p className="ml-4 mt-1">Implement waitlist functionality with notification system. Provide real-time capacity indicators and similar event recommendations to reduce FOMO and registration anxiety.</p>
                </div>
                <div>
                  <strong className="text-gray-900">4. Social Feature Expansion</strong>
                  <p className="ml-4 mt-1">Enhance community-building tools with rich interaction features, friend participation indicators, and collaborative challenges that span across persona types.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-black">Secondary Enhancements</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700 space-y-3">
                <div>
                  <strong className="text-gray-900">5. Push Notification Strategy</strong>
                  <p className="ml-4 mt-1">Develop persona-specific notification cadences: daily summaries for Type A, goal achievement milestones for Type B, event reminders for Type C.</p>
                </div>
                <div>
                  <strong className="text-gray-900">6. Onboarding Optimization</strong>
                  <p className="ml-4 mt-1">Create brief assessment during initial setup to identify likely user type and customize first-time experience accordingly.</p>
                </div>
                <div>
                  <strong className="text-gray-900">7. Reward Catalog Expansion</strong>
                  <p className="ml-4 mt-1">Diversify reward options to appeal to different motivational profiles. Include social rewards (group activities) alongside transactional ones (coupons).</p>
                </div>
                <div>
                  <strong className="text-gray-900">8. Progress Visualization Enhancement</strong>
                  <p className="ml-4 mt-1">Implement multiple progress views: temporal trends for Type A, goal progression for Type B, social engagement metrics for Type C.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">Limitations and Future Research</h2>
          <Card>
            <CardContent className="p-6 text-gray-700 space-y-4">
              <div>
                <strong className="text-gray-900">Methodological Limitations:</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Persona-based analysis relies on archetypal users; real users may exhibit hybrid behavioral patterns</li>
                  <li>Emotional assessments are estimative rather than empirically measured through user research</li>
                  <li>Journey maps represent ideal pathways; actual usage may include errors, distractions, and interruptions</li>
                  <li>Duration estimates require validation through actual usage analytics</li>
                </ul>
              </div>
              <div>
                <strong className="text-gray-900">Future Research Directions:</strong>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Longitudinal study of user behavior patterns over extended time periods (semester/year)</li>
                  <li>Empirical validation of persona classifications through cluster analysis of real user data</li>
                  <li>A/B testing of proposed design interventions to measure impact on engagement metrics</li>
                  <li>Qualitative interviews to capture nuanced emotional experiences and pain point details</li>
                  <li>Cross-institutional comparison to assess generalizability across different school contexts</li>
                  <li>Investigation of negative outcomes (gaming the system, excessive competition, social exclusion)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">Conclusion</h2>
          <div className="text-gray-700 space-y-4 leading-relaxed">
            <p>
              This user journey analysis demonstrates the complexity of designing gamified educational platforms that serve 
              diverse student motivational profiles. The three identified pathways—academic engagement, transactional reward 
              redemption, and social community building—reveal distinct interaction patterns, emotional trajectories, and pain 
              points that require differentiated design approaches.
            </p>
            <p>
              The platform successfully creates multiple value propositions for different user types, evidenced by peak emotional 
              experiences occurring at different journey stages for each persona. However, several design elements inadvertently 
              introduce anxiety and friction, particularly around social comparison, decision-making uncertainty, and resource 
              scarcity. Addressing these pain points through the recommended interventions could significantly enhance user 
              experience while maintaining motivational effectiveness.
            </p>
            <p>
              Most notably, the extended engagement duration and emotional investment observed in the socially-oriented pathway 
              suggests that community-building features may be underutilized relative to their potential impact. Expanding social 
              elements and integrating them across all user journeys could increase overall platform effectiveness in achieving 
              both attendance goals and broader educational objectives of social skill development and community cohesion.
            </p>
            <p>
              Future work should focus on empirical validation of these theoretical findings through user research, analytics 
              analysis, and controlled experimentation. As gamification in education continues to evolve, careful attention to 
              diverse user needs and potential negative consequences will be essential for creating systems that truly support 
              student wellbeing and educational success.
            </p>
          </div>
        </section>

        {/* References */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">References</h2>
          <div className="text-gray-700 space-y-3">
            <p className="ml-8 -indent-8">
              Deterding, S., Dixon, D., Khaled, R., & Nacke, L. (2011). From game design elements to gamefulness: Defining 
              "gamification". <em>Proceedings of the 15th International Academic MindTrek Conference</em>, 9-15.
            </p>
            <p className="ml-8 -indent-8">
              Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits: Human needs and the self-determination 
              of behavior. <em>Psychological Inquiry, 11</em>(4), 227-268.
            </p>
            <p className="ml-8 -indent-8">
              Hamari, J., Koivisto, J., & Sarsa, H. (2014). Does gamification work? A literature review of empirical studies 
              on gamification. <em>Proceedings of the 47th Hawaii International Conference on System Sciences</em>, 3025-3034.
            </p>
            <p className="ml-8 -indent-8">
              Richardson, J. C., Maeda, Y., Lv, J., & Caskurlu, S. (2017). Social presence in relation to students' satisfaction 
              and learning in the online environment: A meta-analysis. <em>Computers in Human Behavior, 71</em>, 402-417.
            </p>
            <p className="ml-8 -indent-8">
              Sailer, M., Hense, J. U., Mayr, S. K., & Mandl, H. (2017). How gamification motivates: An experimental study of 
              the effects of specific game design elements on psychological need satisfaction. <em>Computers in Human Behavior, 69</em>, 371-380.
            </p>
          </div>
        </section>

        {/* Appendix */}
        <section className="mb-12">
          <h2 className="text-black mb-4 pb-2 border-b border-gray-300">Appendix: Emotion Scale Definition</h2>
          <Card>
            <CardContent className="p-6">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-3 text-left text-gray-900">Level</th>
                    <th className="border border-gray-300 p-3 text-left text-gray-900">Label</th>
                    <th className="border border-gray-300 p-3 text-left text-gray-900">Description</th>
                    <th className="border border-gray-300 p-3 text-left text-gray-900">Behavioral Indicators</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-center">
                      <div className="w-6 h-6 rounded-full bg-red-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>1 - Low Engagement</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">User experiences frustration, confusion, or disinterest</td>
                    <td className="border border-gray-300 p-3 text-gray-700">High bounce rate, rapid abandonment, minimal interaction</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-center">
                      <div className="w-6 h-6 rounded-full bg-orange-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>2 - Moderate Disinterest</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">User is uncertain or experiencing mild negative emotions</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Hesitant interaction, seeking clarification, consideration of exit</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-center">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>3 - Neutral/Moderate Interest</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">User is exploring without strong positive or negative emotions</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Information gathering, browsing behavior, evaluative stance</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-center">
                      <div className="w-6 h-6 rounded-full bg-green-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>4 - High Engagement</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">User experiences positive emotions and active interest</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Extended interaction, goal pursuit, positive affect indicators</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3 text-center">
                      <div className="w-6 h-6 rounded-full bg-blue-500 mx-auto" />
                    </td>
                    <td className="border border-gray-300 p-3 text-gray-900"><strong>5 - Peak Experience</strong></td>
                    <td className="border border-gray-300 p-3 text-gray-700">User experiences flow state, joy, or achievement satisfaction</td>
                    <td className="border border-gray-300 p-3 text-gray-700">Deep immersion, goal accomplishment, desire to share/repeat</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}