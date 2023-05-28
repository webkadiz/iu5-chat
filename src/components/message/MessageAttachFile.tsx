import styled from '@emotion/styled';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material';
import prettyBytes from 'pretty-bytes';
import { useContext, useEffect, useRef, useState } from 'react';
import DocumentIcon from '../icons/DocumentIcon';
import { CircularProgressWithLabel } from '../styled/CircularProgressWithLabel';
import Div from '../styled/Div';
import { CreateMessageDto, createMessage } from '../../back';
import { ActiveChatContext } from '../../context/active-chat';
import { useQueryClient } from 'react-query';
import Queries from '../../queries';
import { toast } from 'react-toastify';

export interface SocketMessage<T> {
  type: SocketMessageType;
  payload?: T;
}

export interface UploadFile {
  data: string;
  fileSize: number;
  totalChunks: number;
  chunkIndex: number;
}

export interface SuccessUploadFile {
  finalFileName: string;
}

export interface DownloadFile {
  data: {
    type: 'Buffer';
    data: number[];
  };
  totalChunks: number;
  chunkIndex: number;
}

export interface AttachmentFile {
    url: string;
    name: string;
    type: string; 
    size: number;
}

export enum SocketMessageType {
  DATA = 'Data',
  START_UPLOAD = 'Start upload',
  FINISH_UPLOAD = 'Finish upload',
  START_DOWNLOAD = 'Start download',
  FINISH_DOWNLOAD = 'Finish download',
}

const CHUNK_SIZE: number = 15 * 1e3;

// const SERVER_HOST: string = 'ws://localhost:49160';
// const FILE_HOST: string = 'http://localhost:49160';

export const SERVER_HOST: string = 'ws://95.163.237.79:49160';
export const FILE_HOST: string = 'http://95.163.237.79:49160';

type Props = {
  onSend: (message: CreateMessageDto) => void;
};

const MessageAttachFile = ({ onSend }: Props) => {
  const { activeChat } = useContext(ActiveChatContext);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadSocketRef = useRef<WebSocket | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [choosenFile, setChoosenFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [chunkIndex, setChunkIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const qc = useQueryClient();

  useEffect(() => {
    if (chunkIndex === null) {
      return;
    }

    readAndUploadChunk();
  }, [chunkIndex]);

  const attachFileIconClickHandler = () => {
    if (!fileInputRef.current) return;

    fileInputRef.current.click();
  };

  const readAndUploadChunk = (): void => {
    const reader = new FileReader();

    if (!choosenFile || chunkIndex === null) {
      return;
    }

    const from = (chunkIndex - 1) * CHUNK_SIZE;
    const to = from + CHUNK_SIZE;

    const blob = choosenFile.slice(from, to);

    reader.onload = (e) => uploadChunk(e);
    reader.readAsDataURL(blob);
  };

  const uploadChunk = (readerEvent: ProgressEvent<FileReader>): void => {
    if (!uploadSocketRef.current || chunkIndex === null) {
      return;
    }

    const totalChunks = Math.ceil((choosenFile?.size ?? 0) / CHUNK_SIZE);

    const payload: UploadFile = {
      data: readerEvent.target?.result as string,
      fileSize: choosenFile?.size as number,
      totalChunks,
      chunkIndex,
    };

    const message: SocketMessage<UploadFile> = {
      type: SocketMessageType.DATA,
      payload,
    };

    uploadSocketRef.current.send(JSON.stringify(message));
    setProgress((chunkIndex / totalChunks) * 100);

    if (!(chunkIndex === totalChunks)) {
      setChunkIndex(chunkIndex + 1);

      return;
    }

    setChunkIndex(null);

    setTimeout(() => {
      setProgress(null);
      closeModalHandler();
    }, 1500);
  };

  const attachFileChangeHandler = async () => {
    if (!fileInputRef.current) return;

    const files = fileInputRef.current.files;

    if (!files?.length) return;

    const file = files[0];

    if (['image/jpeg', 'image/png'].includes(file.type)) {
      const reader = new FileReader();

      await new Promise<void>((resolve) => {
        reader.onload = function (e) {
          setPreview(e.target?.result as string);
          resolve();
        };

        reader.onerror = function (err) {
          console.error(err);
          resolve();
        };

        reader.readAsDataURL(file);
      });
    }

    setChoosenFile(file);
    setIsModalOpen(true);
  };

  const uploadFileClickHandler = (): void => {
    const encodedFilename = encodeURIComponent(choosenFile?.name as string);

    const url = `${SERVER_HOST}/upload/file/${encodedFilename}`;
    uploadSocketRef.current = new WebSocket(url);

    uploadSocketRef.current.onopen = function () {
      const message: SocketMessage<void> = {
        type: SocketMessageType.START_UPLOAD,
      };

      uploadSocketRef.current?.send(JSON.stringify(message));

      setChunkIndex(1);
    };

    uploadSocketRef.current.onmessage = async function (event) {
      const { type, payload }: SocketMessage<SuccessUploadFile> = JSON.parse(
        event.data
      );

      switch (type) {
        case SocketMessageType.FINISH_UPLOAD:
          if (payload?.finalFileName) {
            const attachmentFile: AttachmentFile = {
                url: FILE_HOST + '/uploads/' + payload.finalFileName,
                name: choosenFile?.name ?? '',
                type: choosenFile?.type ?? '',
                size: choosenFile?.size ?? 0,
            };

            console.log(attachmentFile);

            if (!activeChat) return;

            try {
              const message = {
                chatId: activeChat.id,
                content: '',
                photos: [],
                attachment: [JSON.stringify(attachmentFile)],
                audio: '',
              };

              console.log(message);

              await createMessage(message);

              onSend(message);

              qc.invalidateQueries(Queries.chat.getMessages(activeChat.id));
            } catch (err) {
              toast.error(`${err}`);
            }
          }
      }
    };

    uploadSocketRef.current.onclose = function () {
      console.log('Connection is closed');
    };

    uploadSocketRef.current.onerror = function (e) {
      console.log(e);
    };
  };

  const closeModalHandler = () => {
    if (!fileInputRef.current) return;

    fileInputRef.current.value = '';
    uploadSocketRef.current = null;

    setTimeout(() => {
      setChoosenFile(null);
      setPreview('');
    }, 400);

    setIsModalOpen(false);
  };

  return (
    <>
      <StyledAttachFileIcon onClick={attachFileIconClickHandler} />
      <FileInput
        type={'file'}
        ref={fileInputRef}
        onChange={attachFileChangeHandler}
      />
      <Dialog open={isModalOpen} onClose={closeModalHandler}>
        <DialogContent>
          {preview ? (
            <Preview src={preview} />
          ) : (
            <Div dflex>
              <DocumentIcon />
              <Div ml={8}>
                <Div bold>{choosenFile?.name}</Div>
                <Div secondary mb={12} mt={8}>
                  {prettyBytes(choosenFile?.size || 0)}
                </Div>
              </Div>
            </Div>
          )}
          <TextField variant="standard" label="Подпись" fullWidth />
          {progress !== null ? (
            <Div dflex jc="center" mb={4} mt={12}>
              <CircularProgressWithLabel value={progress} />
            </Div>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModalHandler}>Отмена</Button>
          <Button onClick={uploadFileClickHandler}>Отправить</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const FileInput = styled.input`
  display: none;
`;

const StyledAttachFileIcon = styled(AttachFileIcon)`
  width: 24px;
  height: 24px;
  font-size: 1.8rem;
  cursor: pointer;
  margin-right: 8px;
  opacity: 0.5;
`;

const Preview = styled.img`
  display: block;
  max-width: 300px;
  max-height: 300px;
  margin-bottom: 12px;
`;

export default MessageAttachFile;
