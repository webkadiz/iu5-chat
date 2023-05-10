import styled from '@emotion/styled';
import prettyBytes from 'pretty-bytes';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Div from '../styled/Div';
import DocumentIcon from '../icons/DocumentIcon';
import { CircularProgressWithLabel } from '../styled/CircularProgressWithLabel';

export interface UploadFile {
    data: string;
    fileName: string;
    fileSize: number;
    totalChunks: number;
    chunkIndex: number;
}

export interface SocketMessage<T> {
    type: SocketMessageType;
    payload?: T;
}

export interface SuccessUploadFile {
    finalFileName: string;
}

export type Payload = UploadFile | SuccessUploadFile;

export enum SocketMessageType {
    DATA = 'Data',
    START_UPLOAD = 'Start upload',
    FINISH_UPLOAD = 'Finish upload',
    START_DOWNLOAD = 'Start download',
    FINISH_DOWNLOAD = 'Finish download',
}

const CHUNK_SIZE: number = 15 * 1e3;

const SERVER_HOST: string = 'ws://localhost:8999';
const FILE_HOST: string = 'http://localhost:8999';

const MessageAttachFile: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [choosenFile, setChoosenFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [chunkIndex, setChunkIndex] = useState<number | null>(null);
    const [finalFileName, setFinalFileName] = useState<string | null>(null);
    const [progress, setProgress] = useState<number | null>(null);

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
        if (!socketRef.current || chunkIndex === null) {
            return;
        }

        const totalChunks = Math.ceil((choosenFile?.size ?? 0) / CHUNK_SIZE);
        console.log(totalChunks);

        const payload: UploadFile = {
            data: readerEvent.target?.result as string,
            fileName: choosenFile?.name as string,
            fileSize: choosenFile?.size as number,
            totalChunks,
            chunkIndex,
        };

        const message: SocketMessage<UploadFile> = {
            type: SocketMessageType.DATA,
            payload,
        };

        socketRef.current.send(JSON.stringify(message));
        setProgress((chunkIndex / (totalChunks)) * 100);

        if (!(chunkIndex === totalChunks)) {
            setChunkIndex(chunkIndex + 1);

            return;
        }

        setChunkIndex(null);

        setTimeout(() => {
            setProgress(null);
        }, 1500);
    };

    const attachFileChangeHandler = async () => {
        if (!fileInputRef.current) return;

        const files = fileInputRef.current.files;

        if (!files?.length) return;

        const file = files[0];

        const url = `${SERVER_HOST}/upload`;
        socketRef.current = new WebSocket(url);

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

    const sendFileClickHandler = async () => {
        if (!socketRef.current) {
            return;
        }

        socketRef.current.onopen = function () {
            console.log('Connected');

            const message: SocketMessage<void> = {
                type: SocketMessageType.START_UPLOAD,
            };

            socketRef.current?.send(JSON.stringify(message));
        };

        socketRef.current.onmessage = function (event) {
            const { type, payload }: SocketMessage<SuccessUploadFile> =
                JSON.parse(event.data);

            switch (type) {
                case SocketMessageType.FINISH_UPLOAD:
                    if (payload) {
                        setFinalFileName(payload.finalFileName);
                    }
            }
        };

        socketRef.current.onclose = function () {
            console.log('Connection is closed');
        };

        socketRef.current.onerror = function (e) {
            console.log(e);
        };

        setChunkIndex(1);
    };

    const closeModalHandler = () => {
        if (!fileInputRef.current) return;

        fileInputRef.current.value = '';
        socketRef.current = null;

        setTimeout(() => {
            setChoosenFile(null);
            setPreview('');
            setFinalFileName(null);
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
                    {finalFileName ? (
                        <a
                            href={FILE_HOST + '/uploads/' + finalFileName}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Div dflex jc="center" mt={12} className="name">
                                {choosenFile?.name}
                            </Div>
                        </a>
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModalHandler}>Отмена</Button>
                    <Button onClick={sendFileClickHandler}>Отправить</Button>
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
