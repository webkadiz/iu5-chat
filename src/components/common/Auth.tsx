import styled from '@emotion/styled';
import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getCurrentUser, loginUser, registerUser } from '../../back';
import { setUserCurrentAction } from '../../state/current-user/slice';

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const [authTab, setAuthTab] = useState('sign');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  const authHandler = async () => {
    if (authTab === 'register') {
      try {
        await registerUser({
          username,
          password,
          phone,
          bio,
          avatar: '',
        });

        const user = await getCurrentUser();

        console.log(user, 'register');

        dispatch(setUserCurrentAction(user));

        toast.success('Регистрация прошла успешно');
      } catch (e) {
        toast.error('Не удалось зарегистрироваться');
      }
    } else {
      try {
        await loginUser({
          phone,
          password,
        });

        const user = await getCurrentUser();

        console.log(user, 'register');

        dispatch(setUserCurrentAction(user));

        toast.success('Вход выполнен');
      } catch (e) {
        toast.error('Не получилось войти в аккаунт');
      }
    }
  };

  return (
    <Container>
      <Bg />
      <FormWrapper>
        <AuthTabWrapper>
          <AuthTab
            $active={authTab === 'sign'}
            onClick={() => setAuthTab('sign')}
          >
            Вход
          </AuthTab>
          <AuthTab
            $active={authTab === 'register'}
            onClick={() => setAuthTab('register')}
          >
            Регистрация
          </AuthTab>
        </AuthTabWrapper>
        <StyledTextField
          label="Телефон"
          fullWidth
          variant="standard"
          value={phone}
          onChange={(e) => setPhone(e.target.value.trim())}
        />
        <StyledTextField
          label="Пароль"
          fullWidth
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
        />
        {authTab === 'register' && (
          <>
            <StyledTextField
              label="Никнейм"
              fullWidth
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
            />
            <StyledTextField
              label="О себе"
              fullWidth
              variant="standard"
              value={bio}
              onChange={(e) => setBio(e.target.value.trim())}
            />
          </>
        )}
        <StyledButton onClick={authHandler}>
          {authTab === 'register' ? 'Зарегистрироваться' : 'Войти'}
        </StyledButton>
      </FormWrapper>
    </Container>
  );
};

const AuthTabWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const AuthTab = styled.div<{ $active: boolean }>`
  font-weight: bold;
  font-size: 20px;
  color: ${(p) => (p.$active ? 'black' : 'rgba(0, 0, 0, 0.6)')};
  cursor: pointer;

  &:after {
    content: '/';
    color: rgba(0, 0, 0, 0.6);
    margin-left: 5px;
    margin-right: 5px;
  }

  &:last-child:after {
    content: '';
  }
`;

const StyledButton = styled(Button)`
  margin-top: auto;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 10px;
`;

const Bg = styled.div`
  position: absolute;
  top: 0;
  height: 30vh;
  width: 100%;
  background: ${(p) => p.theme.colors.brand};
  z-index: 1;
`;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ebebeb;
  height: 100%;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 70px 40px;
  height: 50vh;
  width: 40vw;
  background: white;
  z-index: 2;
`;

export default Auth;
