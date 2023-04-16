import styled from '@emotion/styled';
import prettyBytes from 'pretty-bytes';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Modal,
    TextField,
} from '@mui/material';
import { useRef, useState } from 'react';
import Span from '../styled/Span';
import Div from '../styled/Div';
import DocumentIcon from '../icons/DocumentIcon';

const MessageAttachFile: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [choosenFile, setChoosenFile] = useState<File | null>(null);
    const [preview, setPreview] = useState('');

    const attachFileIconClickHandler = () => {
        if (!fileInputRef.current) return;

        fileInputRef.current.click();
    };

    const attachFileChangeHandler = async () => {
        if (!fileInputRef.current) return;

        const files = fileInputRef.current.files;

        if (!files?.length) return;

        const file = files[0];

        if (['image/jpeg', 'image/png'].includes(file.type)) {
            const reader = new FileReader();

            await new Promise<void>((resolve) => {
                reader.addEventListener('load', () => {
                    console.log('load');
                    setPreview(reader.result as string);
                    resolve();
                });

                reader.addEventListener('error', (err) => {
                    console.error(err);
                    resolve();
                });

                reader.readAsDataURL(file);
            });
        }

        console.log('after open');

        setChoosenFile(file);
        setIsModalOpen(true);
    };

    const closeModalHandler = () => {
        if (!fileInputRef.current) return;

        fileInputRef.current.value = '';
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeModalHandler}>Отмена</Button>
                    <Button>Отправить</Button>
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
