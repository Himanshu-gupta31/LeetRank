"use client"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Zap, ArrowRight, Code2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

export default function Home() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard")
    }
  }, [isSignedIn, router])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Trophy,
      title: "College Leaderboard",
      description: "See how you stack up against other students from your college",
      delay: "delay-100",
    },
    {
      icon: Users,
      title: "Peer Comparison",
      description: "Compare your progress with friends and classmates",
      delay: "delay-200",
    },
    {
      icon: Zap,
      title: "Performance Insights",
      description: "Get detailed insights into your LeetCode performance",
      delay: "delay-300",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background effects container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Existing dots */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neutral-700 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-neutral-600 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-neutral-700 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-neutral-600 rounded-full animate-pulse delay-3000"></div>

        {/* Circular gray lights (blurred) */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gray-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-1/3 w-80 h-80 bg-gray-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-2/3 w-72 h-72 bg-gray-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Snow-like falling dots */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white rounded-full animate-fall opacity-60`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          ></div>
        ))}

        {/* Shooting stars */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-16 bg-gradient-to-b from-white to-transparent animate-shooting-star opacity-80"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 3 + Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <main className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-24 mt-12">
          <div
            className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-white/20 rounded-full text-sm text-white/80 hover:border-white/40 transition-colors duration-300">
              <Code2 className="w-4 h-4" />
              <span>LeetCode College Rankings</span>
            </div>

            <h1 className="text-7xl md:text-8xl font-bold mb-8 tracking-tight">
              <span className="block text-white">Discover Your</span>
              <span className="block text-white/60">College Rank</span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 text-white/70 max-w-2xl mx-auto leading-relaxed">
              Compare your LeetCode performance with peers from your college and climb the leaderboard
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg font-medium group"
              >
                View Leaderboards
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-300 px-8 py-6 text-lg bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-24">
          <div
            className={`text-center mb-16 transform transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Why Choose Us</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Powerful features to help you track and improve your coding journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"} ${feature.delay}`}
              >
                <div className="relative p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-105 bg-white/5 backdrop-blur-sm">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-white transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section
          className={`text-center transform transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <div className="max-w-3xl mx-auto p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Start Competing?</h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Join thousands of students already tracking their progress and competing with their peers
            </p>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90 transition-all duration-300 transform hover:scale-105 px-12 py-6 text-lg font-medium"
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>


    </div>
  )
}
