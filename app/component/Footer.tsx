import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-2xl text-white font-bold mb-4">LeetRank</h2>
              <p className="text-white mb-4">
                Empowering students to track their LeetCode progress and compete with peers from their college.
                Join LeetRank today and elevate your coding skills to new heights!
              </p>
            </div>
            <div>
              <h3 className="text-xl text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-400 hover:text-gray-200 transition-colors">Features</Link></li>
                <li><Link href="#contact" className="text-gray-400 hover:text-gray-200 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-gray-200 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-gray-200 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl text-white font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="https://twitter.com/Himanshuu3112" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="https://github.com/himanshu-gupta31/leetrank" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/akshat-girdhar-56a848206/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="mailto:gupta.him31@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
              <div className="mt-4">
                <h2 className="text-white font-semibold">
                    Built By : 
                    </h2>
                <div>
                    <Link href={"https://himanshuportfolio-eosin.vercel.app/"}>
                    <p className="font-semibold text-white hover:underline cursor-pointer">Himanshu Gupta</p>
                    </Link>
                    <Link href={"https://akshatgirdhar-portfolio.vercel.app/"}>
                    <p className="font-semibold text-white hover:underline cursor-pointer">Akshat Girdhar</p>
                    </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} LeetRank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}