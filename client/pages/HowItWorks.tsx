import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Upload,
  Zap,
  Bell,
  CheckCircle,
  MapPin,
  Brain,
  Shield,
  Clock,
  Users,
  Smartphone,
  Globe,
  ArrowRight,
  Star,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Report Your Item",
      description:
        "Lost something? Found something? Report it in under 2 minutes with our smart form.",
      icon: Upload,
      details: [
        "Upload photos and detailed descriptions",
        "Add precise location information",
        "Set reward amounts (optional)",
        "Choose privacy preferences",
      ],
      color: "bg-blue-100 text-blue-600",
    },
    {
      step: 2,
      title: "AI-Powered Matching",
      description:
        "Our intelligent system instantly analyzes and matches items across our database.",
      icon: Brain,
      details: [
        "Advanced algorithm considers 15+ factors",
        "Location proximity analysis",
        "Date and time correlation",
        "Description similarity matching",
      ],
      color: "bg-purple-100 text-purple-600",
    },
    {
      step: 3,
      title: "Real-Time Notifications",
      description:
        "Get instant alerts when potential matches are found, delivered immediately to your devices.",
      icon: Bell,
      details: [
        "Push notifications to your phone",
        "Email alerts with match details",
        "SMS notifications (optional)",
        "In-app notification center",
      ],
      color: "bg-green-100 text-green-600",
    },
    {
      step: 4,
      title: "Safe Connection",
      description:
        "Connect with item finders/owners through our secure platform with privacy protection.",
      icon: Shield,
      details: [
        "Anonymous contact options",
        "Verified user profiles",
        "Secure messaging system",
        "Identity protection features",
      ],
      color: "bg-orange-100 text-orange-600",
    },
    {
      step: 5,
      title: "Happy Reunion",
      description:
        "Arrange safe meetups and celebrate successful reunions with items and their owners.",
      icon: CheckCircle,
      details: [
        "Secure meetup arrangements",
        "Public location recommendations",
        "Item verification process",
        "Success story sharing",
      ],
      color: "bg-pink-100 text-pink-600",
    },
  ];

  const features = [
    {
      title: "Smart Matching Algorithm",
      description:
        "Our AI considers location, time, description, and visual similarity to find perfect matches.",
      icon: Brain,
      stats: "94% accuracy rate",
    },
    {
      title: "Real-Time Updates",
      description:
        "Get notified instantly when your item is found or when you find a match for someone else.",
      icon: Zap,
      stats: "Under 30 seconds",
    },
    {
      title: "Global Coverage",
      description:
        "Our platform works worldwide with support for multiple languages and currencies.",
      icon: Globe,
      stats: "50+ countries",
    },
    {
      title: "Mobile-First Design",
      description:
        "Report and find items on the go with our optimized mobile experience.",
      icon: Smartphone,
      stats: "iOS & Android",
    },
    {
      title: "Community Driven",
      description:
        "Join thousands of helpful people making a difference in their communities.",
      icon: Users,
      stats: "12,650+ users",
    },
    {
      title: "Secure & Private",
      description:
        "Your personal information is protected with enterprise-grade security.",
      icon: Shield,
      stats: "SSL encrypted",
    },
  ];

  const faqs = [
    {
      question: "How long does it take to find a match?",
      answer:
        "Our average match time is 2.3 hours, but many items are matched within minutes of being reported. The more detailed your description and photos, the faster we can find matches.",
    },
    {
      question: "Is FoundIt free to use?",
      answer:
        "Yes! FoundIt is completely free for all users. You can report lost items, found items, and receive matches without any fees. Rewards are optional and set by the item owner.",
    },
    {
      question: "How does the AI matching work?",
      answer:
        "Our algorithm analyzes multiple factors including item category, location proximity, time stamps, description keywords, and visual characteristics from photos to find the most likely matches.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Absolutely. We use enterprise-grade security, SSL encryption, and offer anonymous contact options. You control what information to share and when to share it.",
    },
    {
      question: "What if I find multiple potential matches?",
      answer:
        "Our system ranks matches by probability and presents them in order of likelihood. You can review each match and choose which ones to pursue further.",
    },
    {
      question: "Can I edit my report after posting?",
      answer:
        "Yes, you can edit your item reports at any time to add more details, update photos, or change contact preferences. Better descriptions lead to better matches!",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-20 text-center">
          <h1 className="text-5xl font-bold mb-6 text-slate-900">
            How FoundIt Works
          </h1>
          <p className="text-xl text-slate-700 max-w-4xl mx-auto font-medium">
            Our AI-powered platform makes finding lost items faster and easier
            than ever. Here's how we're revolutionizing the lost and found
            experience.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-12 text-slate-900">
            The FoundIt Process
          </h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Step Number & Icon */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mb-2`}
                        >
                          <step.icon className="h-8 w-8" />
                        </div>
                        <div className="text-center">
                          <Badge variant="outline" className="font-semibold">
                            Step {step.step}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 text-slate-900">
                          {step.title}
                        </h3>
                        <p className="text-slate-700 mb-4">
                          {step.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {step.details.map((detail, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-sm text-slate-600"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow to next step */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4">
                    <ArrowRight className="h-6 w-6 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-12 text-slate-900">
            Why FoundIt Works Better
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-slate-200 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                    <Badge variant="secondary" className="text-xs">
                      {feature.stats}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-slate-900">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-700">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center mb-12 text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    {faq.question}
                  </CardTitle>
                  <CardDescription className="text-slate-700 leading-relaxed">
                    {faq.answer}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            Ready to Get Started?
          </h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            Join our community of helpful people and start reuniting lost items
            with their owners today. It only takes 2 minutes to make a
            difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/report/lost">
              <Button size="lg" className="w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Report Lost Item
              </Button>
            </Link>
            <Link to="/report/found">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Upload className="mr-2 h-5 w-5" />
                Report Found Item
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 rating</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>12,650+ users</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>15,847 reunions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
