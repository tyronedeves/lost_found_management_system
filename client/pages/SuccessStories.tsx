import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Heart,
  MapPin,
  Clock,
  Quote,
  CheckCircle,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

export default function SuccessStories() {
  const stories = [
    {
      id: 1,
      title: "Lost Wedding Ring Found After 6 Months",
      location: "San Francisco, CA",
      timeToMatch: "2 hours",
      description:
        "Sarah lost her grandmother's wedding ring at Golden Gate Park during her morning jog. After 6 months of searching, someone found it and reported it on FoundIt. Our AI matching system connected them within 2 hours of the report!",
      outcome: "Reunited",
      rating: 5,
      testimonial:
        "I had given up hope after months of searching. FoundIt's notification system alerted me immediately when my ring was found. I'm so grateful for this amazing platform!",
      author: "Sarah M.",
      category: "jewelry",
      reward: 500,
    },
    {
      id: 2,
      title: "College Student's Laptop Returned",
      location: "Austin, TX",
      timeToMatch: "45 minutes",
      description:
        "Jake's laptop containing his final thesis was stolen from a coffee shop. A Good Samaritan found it discarded in a parking lot and used FoundIt to locate Jake. The smart matching system worked perfectly!",
      outcome: "Reunited",
      rating: 5,
      testimonial:
        "My entire college career was on that laptop. FoundIt saved me from having to rewrite my thesis. The person who found it was so kind, and the platform made it easy to connect.",
      author: "Jake R.",
      category: "electronics",
      reward: 200,
    },
    {
      id: 3,
      title: "Lost Dog Returned Home",
      location: "Denver, CO",
      timeToMatch: "30 minutes",
      description:
        "Max, a golden retriever, got loose during a thunderstorm. A neighbor found him and quickly reported on FoundIt. The location-based matching and real-time alerts helped reunite Max with his family in under 30 minutes!",
      outcome: "Reunited",
      rating: 5,
      testimonial:
        "When Max went missing, I was devastated. FoundIt's real-time notifications meant I got an alert the moment someone found him. We were reunited the same evening!",
      author: "Maria L.",
      category: "pets",
      reward: 0,
    },
    {
      id: 4,
      title: "Tourist's Passport and Wallet Found",
      location: "New York, NY",
      timeToMatch: "3 hours",
      description:
        "Visiting from Germany, Hans lost his passport and wallet in Times Square. A local found them and reported on FoundIt. The multilingual support and tourist assistance features helped connect them quickly.",
      outcome: "Reunited",
      rating: 5,
      testimonial:
        "As a tourist, losing my passport was terrifying. FoundIt not only helped me get my documents back but also restored my faith in human kindness. Amazing service!",
      author: "Hans K.",
      category: "documents",
      reward: 100,
    },
    {
      id: 5,
      title: "Vintage Guitar Returned to Musician",
      location: "Nashville, TN",
      timeToMatch: "1 day",
      description:
        "A 1960s vintage Gibson guitar was left in a taxi. The driver found it and used FoundIt to locate the owner. The detailed description matching helped identify the right owner among several claims.",
      outcome: "Reunited",
      rating: 5,
      testimonial:
        "That guitar has been with me for 20 years. I thought I'd never see it again. FoundIt's verification system ensured it got back to the right person - me!",
      author: "Tommy B.",
      category: "other",
      reward: 300,
    },
    {
      id: 6,
      title: "Child's Teddy Bear Reunited",
      location: "Portland, OR",
      timeToMatch: "4 hours",
      description:
        "5-year-old Emma's beloved teddy bear was lost at the zoo. A staff member found it and reported on FoundIt. The heartwarming story and quick connection made a little girl very happy!",
      outcome: "Reunited",
      rating: 5,
      testimonial:
        "Emma wouldn't stop crying without her teddy. When FoundIt helped us find 'Mr. Snuggles', it was like Christmas morning. Thank you for bringing joy back to our family!",
      author: "Jennifer P.",
      category: "toys",
      reward: 0,
    },
  ];

  const stats = [
    { label: "Items Reunited", value: "15,847", icon: CheckCircle },
    { label: "Happy Customers", value: "12,650", icon: Heart },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Average Match Time", value: "2.3hrs", icon: Clock },
  ];

  const categoryIcons: Record<string, string> = {
    jewelry: "💍",
    electronics: "📱",
    pets: "🐕",
    documents: "📄",
    other: "🎸",
    toys: "🧸",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-20 text-center">
          <h1 className="text-5xl font-bold mb-6 text-slate-900">
            Success Stories
          </h1>
          <p className="text-xl text-slate-700 max-w-4xl mx-auto font-medium">
            Real stories from real people who found their lost items through
            FoundIt. Every reunion makes our community stronger.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-slate-200">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories */}
        <div className="space-y-8">
          {stories.map((story) => (
            <Card key={story.id} className="border-slate-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">
                        {categoryIcons[story.category]}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-blue-200 text-blue-700 bg-blue-50"
                      >
                        {story.category}
                      </Badge>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        {story.outcome}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2 text-slate-900">
                      {story.title}
                    </CardTitle>
                    <CardDescription className="text-slate-700">
                      {story.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{story.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span>Matched in {story.timeToMatch}</span>
                  </div>
                  {story.reward > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <Award className="h-4 w-4" />
                      <span>${story.reward} reward</span>
                    </div>
                  )}
                </div>

                {/* Testimonial */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <Quote className="h-5 w-5 text-blue-600 mb-2" />
                  <p className="text-slate-700 italic mb-2">
                    "{story.testimonial}"
                  </p>
                  <p className="text-sm text-slate-600 font-medium">
                    — {story.author}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            Have Your Own Success Story?
          </h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            Join thousands of people who have been reunited with their lost
            items. Report your lost or found items today and be part of our
            growing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/report/lost">
              <Button size="lg" className="w-full sm:w-auto">
                Report Lost Item
              </Button>
            </Link>
            <Link to="/report/found">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Report Found Item
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
