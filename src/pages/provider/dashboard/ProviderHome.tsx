import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProviderStore } from '../../../store/providerStore';
import { useAuthStore } from '../../../store/authStore';
import {
  Eye,
  Inbox,
  Clock,
  Star,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  MessageCircle,
} from 'lucide-react';
import FeedGrid from '../../../components/FeedGrid';

export default function ProviderHome() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const { providerProfile, getStats, enquiries, reviews, updateEnquiryStatus } = useProviderStore();

  const stats = getStats();
  const latestEnquiries = enquiries.slice(0, 3);
  const latestReviews = reviews.slice(0, 2);

  const feedItems = [
    { title: 'New Yoga Class', subtitle: 'Yoga Studio - 10 AM', imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80' },
    { title: 'CrossFit Challenge', subtitle: 'Equinox Fitness - 6 PM', imageUrl: 'https://images.unsplash.com/photo-1558611848-73f7eb4001f9?auto=format&fit=crop&w=400&q=80' },
    { title: 'Zumba Party', subtitle: 'Fitbox Studio - 8 PM', imageUrl: 'https://images.unsplash.com/photo-1518606379990-927f9b5a2d9e?auto=format&fit=crop&w=400&q=80' },
  ];

  const handleCompleteProfile = () => navigate('/provider/dashboard/profile');

  if (!providerProfile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active Provider Profile</h2>
        <p className="text-slate-500 text-sm max-w-md mb-6">
          It looks like you have not completed the fitness listing onboarding yet. Let's register your services.
        </p>
        <button onClick={() => navigate('/provider/onboarding')} className="btn-primary px-6 py-3 font-bold">
          Start Onboarding Wizard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {providerProfile.ownerName || 'Coach'}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here is how {providerProfile.businessName} is performing today.
        </p>
      </div>

      {/* Listing status pill */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Status:</span>
        {providerProfile.listingStatus === 'under_review' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Under Review
          </span>
        ) : providerProfile.listingStatus === 'active' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 border border-green-200 text-green-700">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live & Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-500">Paused</span>
        )}
      </div>

      {/* Profile completion bar */}
      {stats.profileCompletion < 100 && (
        <div className="card p-6 flex items-center justify-between">
          <div className="flex-1 mr-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" /> Complete Your Listing Profile
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Profile is {stats.profileCompletion}% complete. Add photos, pricing, and schedules to improve visibility.
            </p>
            <div className="h-2 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${stats.profileCompletion}%` }} />
            </div>
          </div>
          <button onClick={handleCompleteProfile} className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5">
            Complete Setup <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Profile Views</span>
            <div className="p-2 bg-blue-50 rounded-lg"><Eye className="h-5 w-5 text-blue-600" /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.totalViews}</div>
          <div className="flex items-center text-xs text-green-600 font-medium mt-1">
            <TrendingUp className="h-3.5 w-3.5 mr-1" />+14.2% this week
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Enquiries</span>
            <div className="p-2 bg-purple-50 rounded-lg"><Inbox className="h-5 w-5 text-purple-600" /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.totalEnquiries}</div>
          <div className="text-xs text-slate-500 mt-1">Pending leads</div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Active Batches</span>
            <div className="p-2 bg-orange-50 rounded-lg"><Clock className="h-5 w-5 text-primary" /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.activeBatches}</div>
          <div className="text-xs text-slate-500 mt-1">Current schedule slots</div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Average Rating</span>
            <div className="p-2 bg-amber-50 rounded-lg"><Star className="h-5 w-5 text-amber-500 fill-amber-500" /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.averageRating}<span className="text-sm font-normal text-slate-400">/5</span></div>
          <div className="text-xs text-slate-500 mt-1">Across {stats.totalReviews} reviews</div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Studio Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => navigate('/provider/dashboard/schedule')} className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left">
            <div className="p-2 bg-primary/10 rounded-lg"><PlusCircle className="h-5 w-5 text-primary" /></div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Add Class Slot</h4>
              <p className="text-xs text-slate-500 mt-0.5">Schedule a time slot</p>
            </div>
          </button>
          <button onClick={() => navigate('/provider/dashboard/pricing')} className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left">
            <div className="p-2 bg-primary/10 rounded-lg"><PlusCircle className="h-5 w-5 text-primary" /></div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Add Pricing Plan</h4>
              <p className="text-xs text-slate-500 mt-0.5">List membership price</p>
            </div>
          </button>
          <button onClick={() => navigate('/provider/dashboard/leads')} className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left">
            <div className="p-2 bg-primary/10 rounded-lg"><Inbox className="h-5 w-5 text-primary" /></div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">View Leads</h4>
              <p className="text-xs text-slate-500 mt-0.5">Manage member chats</p>
            </div>
          </button>
          <button onClick={() => navigate('/provider/dashboard/reviews')} className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow text-left">
            <div className="p-2 bg-primary/10 rounded-lg"><MessageCircle className="h-5 w-5 text-primary" /></div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Student Reviews</h4>
              <p className="text-xs text-slate-500 mt-0.5">Reply to feedback</p>
            </div>
          </button>
        </div>
      </div>

      {/* Community Feed */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Community Feed</h2>
        <FeedGrid items={feedItems} />
      </div>

      {/* Leads & Reviews split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest enquiries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" /> Latest Enquiries
            </h3>
            <button onClick={() => navigate('/provider/dashboard/leads')} className="text-sm text-primary hover:underline flex items-center gap-1 font-bold">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {latestEnquiries.length > 0 ? (
            <div className="space-y-3">
              {latestEnquiries.map((enq) => (
                <div key={enq.id} className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{enq.userName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {enq.userPhone} {enq.preferredTiming && `• Prefers: ${enq.preferredTiming}`}
                      </p>
                    </div>
                    {enq.status === 'new' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700">New</span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-500">Contacted</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-3 italic border-l-2 border-slate-200 pl-3">"{enq.message}"</p>
                  {enq.status === 'new' && (
                    <div className="flex justify-end mt-4">
                      <button onClick={() => updateEnquiryStatus(enq.id, 'contacted')} className="btn-primary px-3.5 py-1.5 text-xs">
                        Mark Contacted
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-slate-500 text-sm">No active enquiries yet.</div>
          )}
        </div>

        {/* Latest reviews */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" /> Recent Feedback
            </h3>
            <button onClick={() => navigate('/provider/dashboard/reviews')} className="text-sm text-primary hover:underline flex items-center gap-1 font-bold">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {latestReviews.length > 0 ? (
            <div className="space-y-3">
              {latestReviews.map((rev) => (
                <div key={rev.id} className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.userName}</h4>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-500 text-xs italic">"{rev.comment}"</p>
                  {rev.reply ? (
                    <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600">
                      <span className="block mb-1 font-bold text-primary uppercase text-[10px] tracking-wider">Your Reply:</span>
                      {rev.reply}
                    </div>
                  ) : (
                    <button onClick={() => navigate('/provider/dashboard/reviews')} className="mt-3 text-xs text-primary hover:underline font-bold flex items-center gap-1">
                      Write Reply <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-slate-500 text-sm">No reviews yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
