import * as React from 'react';
import { CssVarsProvider, extendTheme, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';
//import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import SvgIcon from '@mui/joy/SvgIcon';
import { styled } from '@mui/joy';
import Box from '@mui/joy/Box';
//import Typography from '@mui/joy/Typography';
import axios from 'axios';
//import Checkbox from '@mui/joy/Checkbox';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton, { IconButtonProps } from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
//import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import Alert from '@mui/joy/Alert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { UserContext } from "../UserContext";

import { useRef, useState ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import icon from "../assets/4957136_4957136-Photoroom.png";
import icon2 from "../assets/20547283_6310507-Photoroom.png";
import vein from "../assets/vein.png";
function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === 'light' ? 'dark' : 'light');
        onClick?.(event);
      }}
      {...other}
    >
      {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;
const customTheme = extendTheme({
    colorSchemes: {
      light: {},
      dark: {},
    },
    //defaultColorScheme: { light: 'light', dark: 'dark' },
  });
  
export default function Login() {
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userContext = useContext(UserContext);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [submittedData, setSubmittedData] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  if(!userContext)return null;
  const {setUser}=userContext;

  const handleOpenCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };
  const handleDeleteImage=() =>{
    setUploadedImage(null);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };
  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setCapturedImage(imageData);
  };
  const handleSubmit = async () => {
    try {
      setSubmittedData({uid:username,image:capturedImage})
      const response = await axios.post("https://api.example.com/authenticate", submittedData);
      
      if (response.data.message.includes("successfully")) {
        setMessage("Authentication Successful");
        setMessageType("success");
        setUser(username);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage("Authentication Failed");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error: Unable to authenticate");
      setMessageType("error");
    }
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <CssVarsProvider theme={customTheme} defaultColorScheme="dark" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles styles={{ ':root': { '--Form-maxWidth': '800px', '--Transition-duration': '0.4s' } }} />
      <Box sx={{ width: { xs: '100%', md: '50vw' }, position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255 255 255 / 0.2)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', width: '100%', px: 2 }}>
          <Box component="header" sx={{ py: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
          <img 
            src={vein}
            alt="Logo" 
            style={{ width: 32, height: 32 }} // Adjust size as needed
          />
          <Typography level="title-lg">Team VeinChain</Typography>
        </Box>
        <ColorSchemeToggle />
          </Box>
          <Box component="main" sx={{ my: 'auto', py: 2, pb: 5, display: 'flex', flexDirection: 'column', gap: 2, width: 400, maxWidth: '100%', mx: 'auto', borderRadius: 'sm' }}>
            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h3">Log in</Typography>
                <Typography level="body-sm">
                  New to company?{' '}
                  <Link href="" level="title-sm" onClick={() => navigate('/signup')}>Sign Up!</Link>
                </Typography>
              </Stack>
            </Stack>
            <FormControl required>
              <FormLabel>Username</FormLabel>
              <Input type="text" name="email" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </FormControl>
            <Button variant="outlined" onClick={handleOpenCamera}>Camera For Vein Pattern</Button>
            {showCamera ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography level="body-md">Vein Pattern Authentication</Typography>
                <video ref={videoRef} autoPlay className="w-full rounded mb-4" />
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button onClick={captureImage}>Capture</Button>
                  <Button onClick={handleCloseCamera}>Close</Button>
                </Stack>
                {capturedImage && <img src={capturedImage} alt="Captured" style={{ marginTop: '10px', maxWidth: '100%' }} />}
              </Box>
            ):
            (
              <Box sx={{ textAlign: 'center' }}>
              <Stack spacing={2}>
              <Divider>Or</Divider>
            
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color="neutral"
                startDecorator={
                  <SvgIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      />
                    </svg>
                  </SvgIcon>
                }
              >
                Upload a file
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleUploadImage} />
              </Button>
               
              {uploadedImage && <img src={uploadedImage} alt="Captured" style={{ marginTop: '10px', maxWidth: '100%' }} />}
             {uploadedImage && <Button onClick={handleDeleteImage}>Close</Button>}
             </Stack>
            </Box>
            
                      )}
              
            <Stack spacing={2}>
            <Button variant="solid" onClick={handleSubmit} disabled={!username || !(capturedImage||uploadedImage)}>Submit</Button>
            {message && (
                <Alert variant='soft' color={message==="success"?"success":"danger"} startDecorator={messageType === "success" ? <CheckCircleOutlineIcon /> : <ErrorOutlineIcon />}  sx={{ fontWeight: 'md', textAlign: 'center' }}>
                  {message}
                </Alert>
              )}
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" sx={{ textAlign: 'center' }}>
              © VeinChain {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={(theme) => ({
        height: '100%', position: 'fixed', right: 0, top: 0, bottom: 0, left: { xs: 0, md: '50vw' },
        transition: 'background-image var(--Transition-duration), left var(--Transition-duration) !important',
        transitionDelay: 'calc(var(--Transition-duration) + 0.1s)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(255 255 255 / 0.2)',
       backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${icon})`,
        [theme.getColorSchemeSelector('dark')]: {
          backgroundImage: `url(${icon2})`,
          backgroundColor:'rgba(255 255 255 / 0.2)',
        }
      })} />
    </CssVarsProvider>
  );
}
