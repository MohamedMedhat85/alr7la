// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import ResponsiveAppBar from './Pages/HomePage/ResponsiveAppBar.jsx'
import SocialMedia from './SocialMedia.jsx'
import AiSection from './AiSection.jsx'
import Footer from './Footer.jsx'
import TravelDestinationSlider from './TravelDestinationSlider.jsx'
// import ResponsiveAppBarOut from '../../components/ResponsiveAppBarOut.jsx'
// import PlanTrip from './PlanTrip.jsx'

const Home = () => {
    return (
        <>
            {/* <ResponsiveAppBarOut /> */}
            <TravelDestinationSlider />
            <AiSection />
            <SocialMedia />
            {/* <PlanTrip /> */}
            <Footer />
        </>
    );
}

export default Home;
