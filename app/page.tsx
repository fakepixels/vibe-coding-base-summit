"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  useNotification,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button, Icon, Card } from "./components/DemoComponents";
import { useAccount } from "wagmi";

// Poll component to handle voting functionality
function Poll() {
  const { address } = useAccount();
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [voteCounts, setVoteCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const [totalVotes, setTotalVotes] = useState(0);
  const sendNotification = useNotification();

  // Fetch poll data on component mount and when address changes
  useEffect(() => {
    async function fetchPollData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch poll data from API
        const response = await fetch('/api/poll');
        
        if (!response.ok) {
          throw new Error('Failed to fetch poll data');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch poll data');
        }
        
        // Update state with poll data
        setVoteCounts(data.data.voteCounts);
        setTotalVotes(data.data.totalVotes);
        
        // Check if current user has voted
        if (address) {
          const userResponse = await fetch(`/api/poll/user?address=${address}`).catch(() => null);
          if (userResponse?.ok) {
            const userData = await userResponse.json();
            setHasVoted(userData.hasVoted);
          } else {
            setHasVoted(false);
          }
        } else {
          setHasVoted(false);
        }
      } catch (err) {
        console.error('Error fetching poll data:', err);
        setError('Failed to load poll data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPollData();
  }, [address]);

  // Handle vote submission
  const handleVote = async (option: number) => {
    if (!address || hasVoted || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Submit vote to API
      const response = await fetch('/api/poll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          option,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit vote');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit vote');
      }
      
      // Update state with new poll data
      setVoteCounts(data.data.voteCounts);
      setTotalVotes(data.data.totalVotes);
      setHasVoted(true);
      setShowThankYou(true);
      
      // Send a notification
      await sendNotification({
        title: "Thank You for Voting!",
        body: `You&apos;ve successfully voted for option ${option}.`,
      });
      
      // Hide the thank you popup after 3 seconds
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting vote:', err);
      setError('Failed to submit your vote. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Community Poll">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          Please select one option below. Each wallet can vote only once.
        </p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--app-accent)]" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            {error}
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-2 mx-auto block"
            >
              Retry
            </Button>
          </div>
        ) : !address ? (
          <p className="text-yellow-400 text-sm text-center my-4">
            Connect your wallet to vote
          </p>
        ) : hasVoted ? (
          <div className="mb-4">
            <p className="text-[var(--app-accent)] font-medium mb-2">
              You&apos;ve already voted! Thank you for participating.
            </p>
            <p className="text-[var(--app-foreground-muted)] text-sm">
              Current results ({totalVotes} total votes):
            </p>
            <div className="space-y-2 mt-3">
              {[1, 2, 3, 4, 5].map((option) => (
                <div key={option} className="flex items-center">
                  <span className="w-8 text-[var(--app-foreground-muted)]">
                    {option}:
                  </span>
                <div className="flex-1 h-6 bg-[var(--app-gray)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--app-accent)]"
                    style={{
                      width: `${totalVotes ? (voteCounts[option - 1] / totalVotes) * 100 : 0}%`,
                    }}
                  />
                </div>
                  <span className="ml-2 text-[var(--app-foreground-muted)] w-10 text-right">
                    {voteCounts[option - 1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 mb-4">
            {[1, 2, 3, 4, 5].map((option) => (
              <Button
                key={option}
                onClick={() => handleVote(option)}
                variant="outline"
                className="justify-start h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="mr-3 w-6 h-6 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--app-accent)]" />
                  </span>
                ) : (
                  <span className="mr-3 w-6 h-6 flex items-center justify-center bg-[var(--app-accent)] text-white rounded-full">
                    {option}
                  </span>
                )}
                Option {option}
              </Button>
            ))}
          </div>
        )}
        
        {totalVotes > 0 && !hasVoted && !isLoading && (
          <p className="text-[var(--app-foreground-muted)] text-sm">
            {totalVotes} {totalVotes === 1 ? 'person has' : 'people have'} voted so far
          </p>
        )}
      </Card>
      
      {/* Thank you popup */}
      {showThankYou && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-[var(--app-card-bg)] rounded-xl p-6 max-w-sm mx-4 shadow-xl border border-[var(--app-card-border)] animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--app-accent)] flex items-center justify-center">
                <Icon name="check" size="lg" className="text-white" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center mb-2">
              Thank You for Voting!
            </h3>
            <p className="text-[var(--app-foreground-muted)] text-center">
              Your vote has been recorded successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1">
          <Poll />
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
    </div>
  );
}
