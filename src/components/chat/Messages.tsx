import { trpc } from '@/app/_trpc/client';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { Loader2 } from 'lucide-react';

interface MessagesProps {
  fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {
  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        keepPreviousData: true,
      }
    );

  const messages = data?.pages.flatMap((page) => page?.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: 'loading-message',
    isUserMessage: false,
    text: (
      <span className="flex h-full items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [
    ...(true ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  return (
    <div className="flex max-h-[calc(100vh -3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage;

          if (i === combinedMessages.length - 1) {
            return <Message />;
          } else return <Message />;
        })
      ) : isLoading ? (
        <div></div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Messages;
