
import Pattern from '../Ui/Pattern'; // Import the Pattern component
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import homeImage from '../assets/home_i.png';
import logo from '../assets/Logo.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      {/* Add the Pattern component as the background */}
      <Pattern />

      <HomeContent>
        {/* Section 1: Hero Section */}
        <HeroSection>
          <HeroText>
            <AnimatedLogo src={logo} alt="Task Bridge Logo" className="logo" />
            <AnimatedTitle>Welcome to Task Bridge</AnimatedTitle>
            <AnimatedSubtitle>Your Ultimate Platform for Task Management and Team Collaboration</AnimatedSubtitle>
            <ButtonGroup>
              <JoinTeamButton onClick={() => navigate('/login')}>
                <span className="icon">👥</span> Join Your Team
              </JoinTeamButton>
              <CreateTeamButton onClick={() => navigate('/signup')}>
                <span className="icon">⊕</span> Create Team
              </CreateTeamButton>
            </ButtonGroup>
          </HeroText>
          <HeroImage>
            <img src={homeImage} alt="Team Collaboration" />
          </HeroImage>
        </HeroSection>

        {/* Section 2: About Task Bridge */}
        <AboutSection>
          <SectionTitle>What is Task Bridge?</SectionTitle>
          <SectionText>
            Task Bridge is an innovative platform designed to streamline task management and facilitate seamless team collaboration. It provides individuals and teams with a comprehensive set of tools to manage projects, organize tasks, and communicate effectively, all in one place.
          </SectionText>
        </AboutSection>

        {/* Section 3: Features */}
        <FeaturesSection>
          <SectionTitle>Key Features</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <FeatureIcon>📋</FeatureIcon>
              <FeatureTitle>Task Management</FeatureTitle>
              <FeatureText>Easily create, assign, and track tasks with intuitive tools.</FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🤝</FeatureIcon>
              <FeatureTitle>Team Collaboration</FeatureTitle>
              <FeatureText>Work together in real-time with your team members.</FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>📂</FeatureIcon>
              <FeatureTitle>Document Sharing</FeatureTitle>
              <FeatureText>Upload, share, and manage files effortlessly.</FeatureText>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>📊</FeatureIcon>
              <FeatureTitle>Progress Tracking</FeatureTitle>
              <FeatureText>Monitor project progress with detailed analytics.</FeatureText>
            </FeatureCard>
          </FeaturesGrid>
        </FeaturesSection>

        {/* Section 4: Testimonials */}
        <TestimonialsSection>
          <SectionTitle>What Our Users Say</SectionTitle>
          <TestimonialsGrid>
            <TestimonialCard>
              <TestimonialText>"Task Bridge has transformed the way our team works. Highly recommended!"</TestimonialText>
              <TestimonialAuthor>- Priy Mavani</TestimonialAuthor>
            </TestimonialCard>
            <TestimonialCard>
              <TestimonialText>"The task management tools are incredibly intuitive and easy to use."</TestimonialText>
              <TestimonialAuthor>- Krish Shyara</TestimonialAuthor>
            </TestimonialCard>
          </TestimonialsGrid>
        </TestimonialsSection>

        {/* Section 5: Call to Action */}
        <CtaSection>
          <SectionTitle>Ready to Get Started?</SectionTitle>
          <SectionText>Join Task Bridge today and take your team collaboration to the next level.</SectionText>
          <ButtonGroup>
            <JoinTeamButton onClick={() => navigate('/login')}>
              <span className="icon">👥</span> Join Your Team
            </JoinTeamButton>
            <CreateTeamButton onClick={() => navigate('/signup')}>
              <span className="icon">⊕</span> Create Team
            </CreateTeamButton>
          </ButtonGroup>
        </CtaSection>
      </HomeContent>
    </HomeContainer>
  );
};

export default Home;

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

// Styled Components
const HomeContainer = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

const HomeContent = styled.div`
  position: relative;
  z-index: 1; /* Ensure content is above the background */
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const HeroSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4rem 0;
`;

const HeroText = styled.div`
  max-width: 600px;
`;

const AnimatedLogo = styled.img`
margin-top:-80px;
  width: 80px;
  height:auto;
  margin-bottom: 1rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const AnimatedTitle = styled.h1`
  font-size: 3rem;
  color:rgb(101, 131, 252); /* Light blue for the title */
  margin-bottom: 1rem;
  animation: ${fadeIn} 1s ease-in-out;
`;

const AnimatedSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1.5s ease-in-out;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content:center;
`;

const JoinTeamButton = styled.button`
  padding: 0.8rem 1.5rem;
  background:rgb(137, 159, 246); /* Light blue */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(184, 198, 255, 0.3); /* Light blue shadow */
  }
`;

const CreateTeamButton = styled.button`
  padding: 0.8rem 1.5rem;
  background:#E3D2FC;
  color:rgb(39, 45, 71); /* Light blue */
  border: 2px solid #b8c6ff; /* Light blue border */
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(184, 198, 255, 0.3); /* Light blue shadow */
  }
`;

const HeroImage = styled.div`
  img {
    max-width: 500px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    animation: ${float} 4s ease-in-out infinite;
  }
`;

const AboutSection = styled.section`
  padding: 4rem 0;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color:rgb(120, 130, 243); /* Light blue */
  margin-bottom: 1rem;
  animation: ${fadeIn} 1s ease-in-out;
`;

const SectionText = styled.p`
  font-size: 1.1rem;
  color: #555;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeIn} 1.5s ease-in-out;
`;

const FeaturesSection = styled.section`
  padding: 4rem 0;
  text-align: center;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background:rgb(255, 255, 255);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(184, 198, 255, 0.2); /* Light blue shadow */
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #b8c6ff; /* Light blue */
  margin-bottom: 1rem;
`;

const FeatureText = styled.p`
  font-size: 1rem;
  color: #555;
`;

const TestimonialsSection = styled.section`
  padding: 4rem 0;
  text-align: center;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TestimonialCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(184, 198, 255, 0.2); /* Light blue shadow */
  }
`;

const TestimonialText = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
`;

const TestimonialAuthor = styled.p`
  font-weight: bold;
  color: #b8c6ff; /* Light blue */
`;

const CtaSection = styled.section`
  padding: 4rem 0;
  text-align: center;
`;

