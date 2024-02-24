import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// import Card from '@mui/material/Card';

// import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';
import { bgGradient } from '../../theme/css';
import StyleIcon from '@mui/icons-material/Style';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SummarizeIcon from '@mui/icons-material/Summarize';
import QuizIcon from '@mui/icons-material/Quiz';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { useLocation, useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const tools = [
  {
    title: 'Flashcards',
    description: 'AI Generated flashcards',
    icon: <StyleIcon sx={{ fontSize: 40 }} />,
    route: '/flashcards',
  },
  {
    title: 'ChatBot',
    description: 'Have a conversation with Bot about your resource',
    icon: <QuestionAnswerIcon sx={{ fontSize: 40 }} />,
    route: '/chat',
  },
  {
    title: 'Summary',
    description: 'Get a summary about the resource',
    icon: <SummarizeIcon sx={{ fontSize: 40 }} />,
    route: '/summary',
  },
  {
    title: 'Quiz',
    description: 'Take a Quiz',
    icon: <QuizIcon sx={{ fontSize: 40 }} />,
    route: '/quiz',
  },
];

export default function Resource() {
  const navigate = useNavigate();
  const location = useLocation();
  const resource = location.state.resource;
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.6),
          imgUrl: '/background/overlay_2.jpg',
        }),
        paddingTop: 15,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: 1,
      }}
      // height={}
    >
      <Container>
        <Typography variant="h1" sx={{ mb: 5 }}>
          {resource.title}
        </Typography>
        <Typography variant="h2" sx={{ mb: 5 }}>
          Tools
        </Typography>
        <Grid container spacing={3} justifyContent={'center'} >
          {tools.map((item) => (
            <Grid
              key={item.title}
              xs={13}
              sm={5}
              md={4}
              sx={{
                mx: { xs: 2, sm: 4, md: 8 }, 
                marginBottom: 3,
              }}
            >
              <Card
                sx={{
                  boxShadow: 24,
                  backgroundColor: 'transparent',
                  ':hover': {
                    borderColor: 'gray',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                  },
                  height: 1,
                  width: 1,
                }}
                elevation={20}
                onClick={() => navigate(`${item.route}/${resource.id}`)}
              >
                <Stack spacing={2} sx={{ p: 3 }}>
                  <Box display={'flex'} flexDirection={'row'}>
                    <Typography
                      color="inherit"
                      variant="subtitle2"
                      noWrap
                      fontSize={30}
                    >
                      {item.title}
                    </Typography>
                    <Typography m={1} mx={2}>
                      {item.icon}
                    </Typography>
                  </Box>
                  <Typography fontSize={18}>{item.description}</Typography>
                </Stack>
              </Card>
              {/* <Button onClick={() => navigate(`/quiz/${item.id}`)}>Quiz</Button> */}
              {/* <Button onClick={() => navigate(`/summary/${item.id}`)}>Summary</Button>
            <Button onClick={() => navigate(`/chat/${item.id}`)}>Chat</Button>
            <Button onClick={() => navigate(`/flashcards/${item.id}`)}>Flashcards</Button> */}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
