import { Link } from "react-router"

import "../styles/Home.css"
import { Button } from "../components/ui"

const Home = () => {
    return (
        <div class="home">
            <div class="hero-content">
                <span class="hero-eyebrow">INSTANT SYNCHRONOUS WRITING</span>
                <h1 class="hero-title">Pure Text.<br />No Friction.</h1>
                <p class="hero-description">
                    A high-end editorial environment for real-time collaboration. No accounts. No sign-ups. Just the clarity of the written word.
                </p>
                <div class="hero-actions">
                    <Button
                        to="/createConference"
                    >Create Conference</Button>
                    <Button
                        variant="secondary"
                        to="/joinConference"
                    >Join Conference</Button>
                </div>
            </div>
        </div>
    )
}

export default Home