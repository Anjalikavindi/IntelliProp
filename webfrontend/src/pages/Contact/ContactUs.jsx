import React from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import GetStarted from '../../components/GetStarted/GetStarted'
import './ContactUs.css'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ContactUs = () => {
  return (
    <>
      <Header />
      {/* BREADCRUMB SECTION */}
      <div className="breadcrumb-section" style={{backgroundImage: `url('/contact-bg.jpg')`}}>
        <div className="breadcrumb-content">
          <h2>Contact</h2>
          <p>
            <Link to="/" className="breadcrumb-link">Home</Link> / Contact Us
          </p>
        </div>
      </div>

      <div className="contact-wrapper blue-bg">
        <div className="contact-grid innerWidth paddings">
          {/* LEFT SIDE - CONTACT INFO */}
          <div className="contact-info-section">
            <div className="flexColStart c-left">
              {/* <span className="blueText">Contact Us</span> */}
              <span className="primaryText">Contact Us</span>
            </div>
            <p className="contact-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus,
              luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>

            <div className="contact-items">
              <div className="contact-item">
                <div className="icon-box">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>(+94) 77 123 4567</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-box">
                  <FaPhoneAlt />
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>(+94) 74 734 2387</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-box">
                  <FaEnvelope />
                </div>
                <div>
                  <h4>Email</h4>
                  <p>info@leeframe.lk</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-box">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4>Address</h4>
                  <p>45 Temple Road, Kandy</p>
                </div>
              </div>
            </div>
            <hr/>
            <div className="social-media">
              <h4>Social Media</h4>
              <div className="social-icons">
                <FaFacebookF />
                <FaTwitter />
                <FaYoutube />
                <FaInstagram/>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - CONTACT FORM */}
          <div className="contact-form-section">
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Email" required />
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" placeholder="Name" required />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input type="text" placeholder="Phone" />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea rows="5" placeholder="Message"></textarea>
              </div>

              <button type="submit" className="button">Contact Us</button>
            </form>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "transparent" }}>
        <GetStarted />
      </div>
      <Footer />
    </>
  )
}

export default ContactUs
