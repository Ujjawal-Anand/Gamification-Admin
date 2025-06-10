'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreVertical, Edit, Trash, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateChallengeStatus, deleteChallenge, Challenge } from '@/store/challengeSlice';

const statusColors = {
  draft: 'bg-yellow-100 text-yellow-800',
  submitted: 'bg-blue-100 text-blue-800',
  listed: 'bg-green-100 text-green-800',
} as const;

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('all');
  const challenges = useAppSelector((state) => state.challenge.challenges);

  const filteredChallenges = challenges.filter(challenge => 
    activeTab === 'all' ? true : challenge.status === activeTab
  );

  const handleCreateNew = () => {
    router.push('/challenges/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/challenges/new?id=${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/challenges/${id}`);
  };

  const handleDelete = (id: string) => {
    dispatch(deleteChallenge(id));
  };

  const handleStatusChange = (id: string, newStatus: Challenge['status']) => {
    dispatch(updateChallengeStatus({ id, status: newStatus }));
  };

  const getChallengeTitle = (challenge: Challenge) => {
    return challenge.formData.details?.name || 
           challenge.formData.basicInformation?.theme || 
           'Untitled Challenge';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Challenges</h1>
        <Button onClick={handleCreateNew} className="flex items-center gap-2 ml-auto">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="listed">Listed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {filteredChallenges.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground col-span-full">
                No challenges found. Create your first challenge!
              </div>
            ) : (
              filteredChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="cursor-pointer"
                  onClick={() => handleEdit(challenge.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleEdit(challenge.id); }}
                >
                  <Card className="p-0 overflow-hidden">
                    <div className="relative">
                      {challenge.formData.details?.heroImage ? (
                        <img
                          src={challenge.formData.details.heroImage}
                          alt={getChallengeTitle(challenge)}
                          className="w-full h-48 object-cover rounded-t-xl"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-xl">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge className={statusColors[challenge.status]}>
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                            {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 justify-between">
                        <h2 className="text-xl font-semibold">
                          {getChallengeTitle(challenge)}
                        </h2>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); router.push(`/challenges/preview?id=${challenge.id}`); }}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={e => { e.stopPropagation(); handleEdit(challenge.id); }}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {challenge.status === 'draft' && (
                              <DropdownMenuItem onClick={e => { e.stopPropagation(); handleStatusChange(challenge.id, 'submitted'); }}>
                                Submit for Review
                              </DropdownMenuItem>
                            )}
                            {challenge.status === 'submitted' && (
                              <DropdownMenuItem onClick={e => { e.stopPropagation(); handleStatusChange(challenge.id, 'listed'); }}>
                                List Challenge
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={e => { e.stopPropagation(); handleDelete(challenge.id); }}
                              className="text-destructive"
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {challenge.formData.basicInformation?.category && (
                          <p>Category: {challenge.formData.basicInformation.category}</p>
                        )}
                        {challenge.formData.basicInformation?.theme && (
                          <p>Theme: {challenge.formData.basicInformation.theme}</p>
                        )}
                        <p>Last updated: {new Date(challenge.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 