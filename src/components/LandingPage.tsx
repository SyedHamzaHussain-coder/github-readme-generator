import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { init3DAnimation } from '../utils/animation';
import {
  Sparkles, Zap, Github, ArrowRight, Star, GitFork, Activity, 
  TrendingUp, Users, Calendar, Code, Coffee, Layers
} from 'lucide-react';

export default function LandingPage(): JSX.Element {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      init3DAnimation(canvasRef.current);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <canvas 
          ref={canvasRef} 
          width="600" 
          height="400" 
          className="absolute top-0 right-0 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-xl shadow-2xl">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold">README.ai</h1>
            <p className="text-purple-300 text-sm">AI-Powered Documentation</p>
          </div>
        </div>
      </nav>

      {/* Main Content Layout */}
      <div className="relative z-10 grid grid-cols-2 gap-16 max-w-8xl mx-auto px-8 min-h-[calc(100vh-80px)] py-8">
        {/* Left Side - Text Content */}
        <div className="flex flex-col justify-start pt-16 space-y-6 pr-8">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
          <div className="inline-flex items-center bg-purple-500/20 rounded-full px-4 py-2 w-fit backdrop-blur-sm border border-purple-500/30">
            <Zap className="w-4 h-4 mr-2 text-yellow-400" />
            <span className="text-sm font-medium">AI-Powered • Lightning Fast • Professional</span>
          </div>
            
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Generate
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Professional</span>
            <br />
            READMEs with AI
          </h1>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
            Transform your GitHub repositories and profile with AI-generated documentation. 
            Create stunning, professional READMEs in seconds, not hours.
          </p>
            
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/connect')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group"
            >
              <Github className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => navigate('/examples')}
              className="border border-purple-500/50 hover:border-purple-400 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:bg-purple-500/10 backdrop-blur-sm"
            >
              View Examples
            </button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Code className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">50k+</div>
              <div className="text-sm text-gray-400">READMEs Generated</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">10k+</div>
              <div className="text-sm text-gray-400">Happy Developers</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">99%</div>
              <div className="text-sm text-gray-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Right Side - 3D Cards */}
        <div className="relative flex items-start justify-center pl-8 overflow-visible min-h-[800px]">
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i} 
                className="firefly"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`
                }}
              ></div>
            ))}
          </div>

          {/* Repository README Preview Card */}
          <div className="absolute left-8 top-16 transform hover:translate-x-6 hover:scale-105 hover:rotate-1 transition-all duration-700 z-30 w-[350px] group"
               style={{ transformStyle: 'preserve-3d', animation: 'floatAndTilt 8s ease-in-out infinite' }}>
            <div className="relative cursor-pointer perspective-1000" style={{ transform: 'rotateY(-15deg) rotateX(8deg)', transformStyle: 'preserve-3d' }}>
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-3xl blur-2xl opacity-40 group-hover:opacity-80 group-hover:animate-pulse transition-all duration-700"></div>
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-3xl p-8 shadow-2xl relative backdrop-blur-xl border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-500">
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-white/5 rounded-2xl backdrop-blur-sm"></div>
                
                {/* Header */}
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 p-0.5 rotate-12 hover:rotate-45 transition-transform duration-500">
                      <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center -rotate-12">
                        <span className="text-lg">�</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        awesome-project
                      </div>
                      <div className="text-xs text-gray-400">Repository README</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div className="text-purple-300 font-mono text-sm font-bold flex items-center typing-effect">
                      <span className="text-blue-400 mr-2">#</span> 
                      <span className="typing-text">AI-Generated README.md</span>
                      <span className="cursor-blink">|</span>
                    </div>

                    {/* Live Commit Activity */}
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Recent Activity</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400">Live</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 animate-slideIn" style={{ animationDelay: '0s' }}>
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span className="text-xs text-gray-300">feat: Added AI README generator</span>
                        </div>
                        <div className="flex items-center space-x-2 animate-slideIn" style={{ animationDelay: '1s' }}>
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-xs text-gray-300">docs: Updated documentation</span>
                        </div>
                        <div className="flex items-center space-x-2 animate-slideIn" style={{ animationDelay: '2s' }}>
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-gray-300">fix: Improved performance</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Stats with Progress Bars */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gradient-to-br from-purple-500/20 to-transparent rounded-lg p-2 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent shimmer"></div>
                        <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1 animate-spin-slow" />
                        <div className="text-lg font-bold text-purple-300 counter" data-target="2500">0</div>
                        <div className="text-xs text-gray-400">Stars</div>
                        <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                          <div className="bg-gradient-to-r from-purple-500 to-yellow-400 h-1 rounded-full animate-progressBar" style={{ width: '0%', animationDelay: '0.5s' }}></div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500/20 to-transparent rounded-lg p-2 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent shimmer" style={{ animationDelay: '1s' }}></div>
                        <GitFork className="w-4 h-4 text-blue-400 mx-auto mb-1 animate-bounce" />
                        <div className="text-lg font-bold text-blue-300 counter" data-target="180">0</div>
                        <div className="text-xs text-gray-400">Forks</div>
                        <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1 rounded-full animate-progressBar" style={{ width: '0%', animationDelay: '1s' }}></div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-500/20 to-transparent rounded-lg p-2 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent shimmer" style={{ animationDelay: '2s' }}></div>
                        <Activity className="w-4 h-4 text-green-400 mx-auto mb-1 animate-pulse" />
                        <div className="text-lg font-bold text-green-300">Active</div>
                        <div className="text-xs text-gray-400">Status</div>
                        <div className="flex justify-center mt-1">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Activity Graph with Hover Effects */}
                    <div className="relative h-20 bg-gray-800/30 rounded-lg p-2 border border-gray-600/30">
                      <div className="absolute top-1 left-2 text-xs text-gray-400">Commits</div>
                      <div className="flex items-end space-x-1 h-full pt-4">
                        {[30, 50, 25, 70, 40, 60, 35, 55, 45, 65, 50, 75, 80, 45, 60].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-purple-600/60 via-blue-500/60 to-cyan-400/60 rounded-t-sm cursor-pointer hover:from-purple-500 hover:via-blue-400 hover:to-cyan-300 transition-all duration-300 relative group"
                            style={{ 
                              height: `${height}%`,
                              animation: `graphBar 2s ease-out ${i * 0.1}s both`,
                              minHeight: '2px',
                              '--target-height': `${height}%`
                            } as any}
                          >
                          </div>
                        ))}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-1">
                        <span>Jan</span>
                        <span>Dec</span>
                      </div>
                    </div>

                    {/* Language Usage Chart */}
                    <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/30">
                      <div className="text-xs text-gray-400 mb-2">Languages</div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-xs text-gray-300 flex-1">TypeScript</span>
                          <span className="text-xs text-gray-400">65%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full animate-progressBar" 
                            style={{ 
                              width: '0%', 
                              animationDelay: '1s',
                              '--target-width': '65%'
                            } as any}
                          ></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs text-gray-300 flex-1">JavaScript</span>
                          <span className="text-xs text-gray-400">25%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-yellow-500 h-1.5 rounded-full animate-progressBar" 
                            style={{ 
                              width: '0%', 
                              animationDelay: '1.5s',
                              '--target-width': '25%'
                            } as any}
                          ></div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-xs text-gray-300 flex-1">CSS</span>
                          <span className="text-xs text-gray-400">10%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-red-500 h-1.5 rounded-full animate-progressBar" 
                            style={{ 
                              width: '0%', 
                              animationDelay: '2s',
                              '--target-width': '10%'
                            } as any}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile README Preview Card */}
          <div className="absolute right-8 top-16 transform hover:-translate-x-6 hover:scale-105 hover:-rotate-1 transition-all duration-700 z-30 w-[350px] group"
               style={{ transformStyle: 'preserve-3d', animation: 'floatAndTilt 8s ease-in-out infinite reverse' }}>
            <div className="relative cursor-pointer perspective-1000" style={{ transform: 'rotateY(15deg) rotateX(8deg)', transformStyle: 'preserve-3d' }}>
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-40 group-hover:opacity-80 group-hover:animate-pulse transition-all duration-700"></div>
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-3xl p-8 shadow-2xl relative border border-gray-700/50 group-hover:border-blue-500/50 transition-all duration-500">
                {/* Animated Profile Section */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1 animate-spin-slow">
                      <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-xl">�‍💻</span>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                      Alex Johnson
                    </div>
                    <div className="text-sm text-gray-400">Full Stack Developer</div>
                  </div>
                </div>

                {/* Enhanced Contribution Grid with Interactive Features */}
                <div className="mb-4">
                  <div className="text-xs text-gray-400 mb-2 flex items-center justify-between">
                    <span>Contribution Activity</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-700 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-800 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-sm"></div>
                      <div className="w-2 h-2 bg-purple-300 rounded-sm"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    {Array(84).fill(0).map((_, i) => {
                      const intensity = Math.floor(Math.random() * 5);
                      const colors = ['bg-gray-700', 'bg-purple-800', 'bg-purple-600', 'bg-purple-400', 'bg-purple-300'];
                      const hoverColors = ['hover:bg-gray-500', 'hover:bg-purple-600', 'hover:bg-purple-400', 'hover:bg-purple-200', 'hover:bg-purple-100'];
                      return (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-sm cursor-pointer hover:scale-125 transition-all duration-200 relative group ${colors[intensity]} ${hoverColors[intensity]}`}
                          style={{ 
                            animation: `fadeIn 0.1s ease-out ${i * 0.02}s both`,
                          }}
                        >
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Activity Summary with Animation */}
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <span>Less</span>
                    <div className="flex items-center space-x-2">
                      <span className="animate-counter">1,847</span>
                      <span>contributions this year</span>
                    </div>
                    <span>More</span>
                  </div>
                </div>

                {/* Enhanced Stats with Real-time Animation */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-purple-500/20 rounded-lg p-2 text-center relative overflow-hidden group">
                    <div className="relative z-10">
                      <Coffee className="w-4 h-4 text-purple-400 mx-auto mb-1 animate-bounce" style={{ animationDuration: '2s' }} />
                      <div className="text-sm font-bold text-white animate-counter">1,247</div>
                      <div className="text-xs text-gray-400">Commits</div>
                      <div className="text-xs text-purple-400 mt-1">+5 today</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="bg-blue-500/20 rounded-lg p-2 text-center relative overflow-hidden group">
                    <div className="relative z-10">
                      <Layers className="w-4 h-4 text-blue-400 mx-auto mb-1 animate-spin" style={{ animationDuration: '4s' }} />
                      <div className="text-sm font-bold text-white animate-counter">28</div>
                      <div className="text-xs text-gray-400">Projects</div>
                      <div className="text-xs text-blue-400 mt-1">+2 this week</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="bg-green-500/20 rounded-lg p-2 text-center relative overflow-hidden group">
                    <div className="relative z-10">
                      <Calendar className="w-4 h-4 text-green-400 mx-auto mb-1 animate-pulse" />
                      <div className="text-sm font-bold text-white animate-counter">143</div>
                      <div className="text-xs text-gray-400">Streak</div>
                      <div className="text-xs text-green-400 mt-1">🔥 active</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" style={{ animationDelay: '2s' }}></div>
                  </div>
                </div>

                {/* Live Skills Progress Chart */}
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/30 mb-4">
                  <div className="text-xs text-gray-400 mb-3 flex items-center">
                    <Code className="w-3 h-3 mr-1" />
                    Skills Progress
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">React/TypeScript</span>
                        <span className="text-purple-400">92%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full animate-progressBar" 
                          style={{ 
                            width: '0%', 
                            animationDelay: '0.5s',
                            '--target-width': '92%'
                          } as any}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">Node.js/APIs</span>
                        <span className="text-blue-400">87%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full animate-progressBar" 
                          style={{ 
                            width: '0%', 
                            animationDelay: '1s',
                            '--target-width': '87%'
                          } as any}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-300">UI/UX Design</span>
                        <span className="text-green-400">78%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full animate-progressBar" 
                          style={{ 
                            width: '0%', 
                            animationDelay: '1.5s',
                            '--target-width': '78%'
                          } as any}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Status */}
                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-600/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Online</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                      <span className="text-xs text-gray-300">Open to collaborate</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-300">
                      <span className="animate-typing">Working on AI-powered tools...</span>
                      <span className="animate-blink">|</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Last seen: just now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connecting line */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-1 bg-gradient-to-r from-purple-500/40 via-blue-500/60 to-purple-500/40 blur-sm"></div>
        </div>
      </div>

      {/* Bottom padding for scroll space */}
      <div className="h-32"></div>

      <style>{`
        @keyframes floatAndTilt {
          0%, 100% { 
            transform: translateY(0px) rotateZ(0deg) rotateY(0deg); 
          }
          25% { 
            transform: translateY(-20px) rotateZ(1deg) rotateY(2deg); 
          }
          50% { 
            transform: translateY(-10px) rotateZ(-1deg) rotateY(-2deg); 
          }
          75% { 
            transform: translateY(-25px) rotateZ(0.5deg) rotateY(1deg); 
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-15px) rotateY(5deg); }
        }

        @keyframes graphBar {
          from { height: 0%; opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes graphBar {
          from { height: 0%; opacity: 0; }
          to { height: var(--target-height, 100%); opacity: 1; }
        }

        @keyframes typing {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes progressBar {
          from { width: 0%; }
          to { 
            width: var(--target-width, 100%); 
          }
        }

        @keyframes counter {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .firefly {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(139, 92, 246, 1) 0%, rgba(139, 92, 246, 0.5) 50%, transparent 100%);
          border-radius: 50%;
          filter: blur(1px);
          animation: firefly 8s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
        }

        @keyframes firefly {
          0% { 
            transform: translate(0, 0) scale(0) rotate(0deg); 
            opacity: 0; 
          }
          10% { 
            opacity: 1; 
            transform: scale(1) rotate(45deg); 
          }
          50% { 
            transform: translate(80px, -80px) scale(1.2) rotate(180deg); 
            opacity: 1; 
          }
          90% { 
            opacity: 0.5; 
            transform: scale(0.8) rotate(270deg); 
          }
          100% { 
            transform: translate(150px, -150px) scale(0) rotate(360deg); 
            opacity: 0; 
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .animate-count {
          animation: countUp 2s ease-out forwards;
        }

        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Add shimmer effect */
        .shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s infinite;
        }

        /* Enhanced glow effects */
        .card-glow {
          position: relative;
          overflow: hidden;
        }

        .card-glow::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent);
          border-radius: inherit;
          z-index: -1;
          animation: rotate 4s linear infinite;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
