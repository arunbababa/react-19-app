export type UseFeedBack = () => {
  text: string;
  feedBackList: string[];
  handleTextArea: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFeedBackTextArea: () => void;
};
