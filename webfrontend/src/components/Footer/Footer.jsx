import React from 'react'
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { MdLocationOn, MdPhone } from "react-icons/md";
import { FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        {/* About Section */}
        <div className="flexColStart f-section">
          <img src="/intellipropicon.png" alt="logo" width={220} />
          <span className="secondaryText">
            Our vision is to make all people <br />
            the best place to live for them.
          </span>
        </div>

        {/* Links Section */}
        <div className="flexColStart f-section">
          <span className="primaryText">Links</span>
          <div className="flexColStart f-links">
            <span className="secondaryText">Home</span>
            <span className="secondaryText">Property</span>
            <span className="secondaryText">Services</span>
            <span className="secondaryText">About Us</span>
            <span className="secondaryText">Contact</span>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="flexColStart f-section">
          <span className="primaryText">Social Media</span>
          <div className="flexStart f-socials">
            <FaFacebookF />
            <FaInstagram />
            <FaTwitter />
            <FaLinkedinIn />
          </div>
        </div>

        {/* Contact Details Section */}
        <div className="flexColStart f-section">
          <span className="primaryText">Contact Details</span>

          <div className="flexStart f-contact-item">
            <MdLocationOn className="f-icon" />
            <span className="secondaryText">145 Peradeniya road, Kandy</span>
          </div>

          <div className="flexStart f-contact-item">
            <MdPhone className="f-icon" />
            <span className="secondaryText">(+94) 123 456 456</span>
          </div>

          <div className="flexStart f-contact-item">
            <FiMail className="f-icon" />
            <span className="secondaryText">info@intelliprop.com</span>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Footer
