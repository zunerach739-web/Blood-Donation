import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Heart,
  Droplet,
  Search,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Users,
  Menu,
  X,
  ShieldCheck,
  Activity,
  Globe,
  ArrowRight,
  Pencil,
  Save
} from "lucide-react";

import "./App.css";

// BACKEND API URL
const API_URL = "https://blood-donation-wl1l.vercel.app/api/donors";

// WEBSITE OWNER WHATSAPP
const OWNER_WHATSAPP = "923341448063";

const bloodGroups = [
  "A+", "A-", "B+", "B-",
  "AB+", "AB-", "O+", "O-"
];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  bloodGroup: "",
  location: "",
  weight: "",
  disease: "",
  available: "Yes"
};

function App() {

  // DONORS
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // SEARCH
  const [searchBlood, setSearchBlood] = useState("All");
  const [searchLocation, setSearchLocation] = useState("");

  // NAVIGATION
  const [activePage, setActivePage] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);

  // REGISTRATION FORM
  const [form, setForm] = useState(emptyForm);

  // EDIT DONOR
  const [editingDonorId, setEditingDonorId] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    email: "",
    bloodGroup: "",
    location: "",
    available: "Yes"
  });

  const [updating, setUpdating] = useState(false);

  // FETCH DONORS FROM MONGODB
  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setDonors(response.data.donors || []);

    } catch (error) {
      console.error("Fetch donors error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to load donors. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // LOAD DONORS WHEN WEBSITE OPENS
  useEffect(() => {
    fetchDonors();
  }, []);

  // HANDLE REGISTRATION FORM INPUTS
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // REGISTER DONOR
  const registerDonor = async (e) => {
    e.preventDefault();

    if (Number(form.weight) <= 0) {
      alert("Please enter a valid weight.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/register`,
        form
      );

      alert(
        response.data.message ||
        "Donor registered successfully!"
      );

      setForm({ ...emptyForm });

      await fetchDonors();

      setActivePage("donors");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  // OPEN EDIT FORM
  const startEditing = (donor) => {
    setEditingDonorId(donor._id);

    setEditForm({
      name: donor.name || "",
      phone: donor.phone || "",
      email: donor.email || "",
      bloodGroup: donor.bloodGroup || "",
      location: donor.location || "",
      available: donor.available || "Yes"
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // HANDLE EDIT FORM INPUTS
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  // UPDATE DONOR IN MONGODB
  const updateDonor = async (e) => {
    e.preventDefault();

    if (!editingDonorId) return;

    try {
      setUpdating(true);

      const response = await axios.put(
        `${API_URL}/${editingDonorId}`,
        editForm
      );

      alert(
        response.data.message ||
        "Donor updated successfully!"
      );

      setEditingDonorId(null);

      setEditForm({
        name: "",
        phone: "",
        email: "",
        bloodGroup: "",
        location: "",
        available: "Yes"
      });

      await fetchDonors();

    } catch (error) {
      console.error("Update donor error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update donor. Please try again."
      );

    } finally {
      setUpdating(false);
    }
  };

  // CANCEL EDITING
  const cancelEditing = () => {
    setEditingDonorId(null);

    setEditForm({
      name: "",
      phone: "",
      email: "",
      bloodGroup: "",
      location: "",
      available: "Yes"
    });
  };

  // DELETE DONOR FROM MONGODB
  const deleteDonor = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donor?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${API_URL}/${id}`
      );

      alert(
        response.data.message ||
        "Donor deleted successfully!"
      );

      if (editingDonorId === id) {
        cancelEditing();
      }

      await fetchDonors();

    } catch (error) {
      console.error("Delete error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to delete donor."
      );
    }
  };

  // FILTER DONORS
  const filteredDonors = donors.filter((donor) => {
    const bloodMatch =
      searchBlood === "All" ||
      donor.bloodGroup === searchBlood;

    const locationMatch =
      (donor.location || "")
        .toLowerCase()
        .includes(searchLocation.toLowerCase());

    return (
      bloodMatch &&
      locationMatch &&
      donor.available === "Yes"
    );
  });

  // WHATSAPP FUNCTION
  const openWhatsApp = (phone, message) => {
    const cleanPhone = phone.replace(/\D/g, "");

    window.open(
      `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // CONTACT WEBSITE OWNER
  const contactOwner = () => {
    openWhatsApp(
      OWNER_WHATSAPP,
      "Hello! I want to contact the Blood Donation Website team."
    );
  };

  // NAVIGATION FUNCTION
  const goTo = (page) => {
    setActivePage(page);
    setMobileMenu(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="website">

      {/* NAVBAR */}

      <nav className="navbar">
        <div className="nav-container">

          <div
            className="logo"
            onClick={() => goTo("home")}
          >
            <div className="logo-icon">
              <Droplet size={25} fill="white" />
            </div>

            <span>
              Life<span className="red">Drop</span>
            </span>
          </div>

          <div className={`nav-links ${mobileMenu ? "show" : ""}`}>

            <button onClick={() => goTo("home")}>
              Home
            </button>

            <button onClick={() => goTo("donors")}>
              Find Donors
            </button>

            <button onClick={() => goTo("register")}>
              Become a Donor
            </button>

            <button onClick={() => goTo("about")}>
              About Us
            </button>

          </div>

          <button
            className="nav-register"
            onClick={() => goTo("register")}
          >
            <Heart size={17} />
            Donate Blood
          </button>

          <button
            className="menu-btn"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>

        </div>
      </nav>

      {/* HOME PAGE */}

      {activePage === "home" && (
        <>

          <section className="hero">

            <div className="hero-content">

              <div className="hero-tag">
                <Heart size={15} fill="currentColor" />
                SAVE LIVES. DONATE BLOOD.
              </div>

              <h1>
                Your Blood Can
                <br />
                <span>Give Someone</span>
                <br />
                Another Tomorrow.
              </h1>

              <p>
                Join our worldwide blood donation community.
                Connect blood donors with people who need
                blood and help save precious lives.
              </p>

              <div className="hero-buttons">

                <button
                  className="primary-btn"
                  onClick={() => goTo("register")}
                >
                  Become a Donor
                  <ArrowRight size={18} />
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => goTo("donors")}
                >
                  Find Blood Donors
                </button>

              </div>

              <div className="hero-trust">
                <ShieldCheck size={18} />
                Connecting donors and people in need
              </div>

            </div>

            <div className="hero-image">

              <img
                src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=900"
                alt="Blood donation"
              />

              <div className="floating-card">

                <div className="floating-icon">
                  <Heart fill="white" />
                </div>

                <div>
                  <strong>Be a Hero</strong>
                  <p>Every donation matters.</p>
                </div>

              </div>

            </div>

          </section>

          {/* STATISTICS */}

          <section className="stats">

            <div className="stat">
              <Users size={28} />
              <h2>{donors.length}+</h2>
              <p>Registered Donors</p>
            </div>

            <div className="stat">
              <Droplet size={28} />
              <h2>8</h2>
              <p>Blood Groups</p>
            </div>

            <div className="stat">
              <Globe size={28} />
              <h2>Worldwide</h2>
              <p>Our Vision</p>
            </div>

            <div className="stat">
              <Heart size={28} />
              <h2>One Mission</h2>
              <p>Save Lives</p>
            </div>

          </section>

          {/* HOW IT WORKS */}

          <section className="section">

            <div className="section-heading">
              <span>HOW IT WORKS</span>
              <h2>Saving Lives Is Simple</h2>
              <p>
                Three simple steps to connect and help someone.
              </p>
            </div>

            <div className="steps">

              <div className="step-card">

                <div className="step-icon">
                  <UserPlus size={30} />
                </div>

                <h3>1. Register</h3>

                <p>
                  Create your donor profile with your
                  blood group and contact details.
                </p>

              </div>

              <div className="step-card">

                <div className="step-icon">
                  <Search size={30} />
                </div>

                <h3>2. Find Donors</h3>

                <p>
                  Search for available donors by
                  blood group and location.
                </p>

              </div>

              <div className="step-card">

                <div className="step-icon">
                  <Heart size={30} />
                </div>

                <h3>3. Save Lives</h3>

                <p>
                  Contact matching donors through
                  WhatsApp, phone or email.
                </p>

              </div>

            </div>

          </section>

          {/* BLOOD GROUPS */}

          <section className="blood-section">

            <div className="section-heading">
              <span>BLOOD TYPES</span>
              <h2>Explore Blood Groups</h2>
              <p>
                Select a blood group to find matching donors.
              </p>
            </div>

            <div className="blood-grid">

              {bloodGroups.map((group) => (

                <button
                  className="blood-card"
                  key={group}
                  onClick={() => {
                    setSearchBlood(group);
                    goTo("donors");
                  }}
                >

                  <Droplet size={28} fill="#e63946" />

                  <h3>{group}</h3>

                  <span>Find Donors</span>

                </button>

              ))}

            </div>

          </section>

          {/* CALL TO ACTION */}

          <section className="cta">

            <h2>Become Someone's Lifesaver Today!</h2>

            <p>
              Your small act of kindness can give someone
              a second chance at life.
            </p>

            <button
              className="primary-btn"
              onClick={() => goTo("register")}
            >
              Register as Donor
              <ArrowRight size={18} />
            </button>

          </section>

        </>
      )}

      {/* DONOR REGISTRATION */}

      {activePage === "register" && (

        <section className="page-section">

          <div className="section-heading">

            <span>JOIN OUR COMMUNITY</span>

            <h2>Become a Blood Donor</h2>

            <p>
              Complete the form below to register as a donor.
            </p>

          </div>

          <form
            className="donor-form"
            onSubmit={registerDonor}
          >

            <h3>Personal Information</h3>

            <div className="form-grid">

              <div className="form-group">
                <label>Full Name *</label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. +923001234567"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                />
              </div>

              <div className="form-group">
                <label>Blood Group *</label>

                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Blood Group</option>

                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>City / Location *</label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  required
                />
              </div>

              <div className="form-group">
                <label>Weight (KG) *</label>

                <input
                  type="number"
                  name="weight"
                  min="1"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="Enter weight in KG"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>
                  Any Disease or Medical Condition?
                </label>

                <textarea
                  name="disease"
                  value={form.disease}
                  onChange={handleChange}
                  placeholder="Mention relevant medical conditions (optional)"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Available for Donation? *</label>

                <select
                  name="available"
                  value={form.available}
                  onChange={handleChange}
                  required
                >
                  <option value="Yes">Yes, Available</option>
                  <option value="No">No, Not Available</option>
                </select>
              </div>

            </div>

            <div className="form-notice">
              <ShieldCheck size={22} />

              <p>
                Your medical information is sensitive.
                It should only be accessed by authorized
                personnel after secure registration and verification.
              </p>
            </div>

            <label className="consent">
              <input type="checkbox" required />

              I confirm that the information provided is accurate
              and agree to be contacted about blood donation.
            </label>

            <button
              className="submit-btn"
              type="submit"
            >
              <UserPlus size={19} />
              Register as Donor
            </button>

          </form>

        </section>

      )}

      {/* FIND DONORS PAGE */}

      {activePage === "donors" && (

        <section className="page-section">

          <div className="section-heading">

            <span>DONOR DIRECTORY</span>

            <h2>Find Blood Donors</h2>

            <p>
              Search available donors by blood group and location.
            </p>

          </div>

          <div className="search-panel">

            <div className="form-group">
              <label>Blood Group</label>

              <select
                value={searchBlood}
                onChange={(e) => setSearchBlood(e.target.value)}
              >
                <option value="All">All Blood Groups</option>

                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Search city or country"
              />
            </div>

            <button
              className="search-btn"
              onClick={fetchDonors}
              disabled={loading}
            >
              <Search size={19} />
              {loading ? "Loading..." : "Search"}
            </button>

          </div>

          <div className="results-heading">

            <h3>Available Donors</h3>

            <span>
              {filteredDonors.length} results found
            </span>

          </div>

          {/* EDIT DONOR FORM */}

          {editingDonorId && (

            <form
              className="donor-form"
              onSubmit={updateDonor}
              style={{ marginBottom: "35px" }}
            >

              <h3>
                <Pencil size={20} />
                Edit Donor Profile
              </h3>

              <div className="form-grid">

                <div className="form-group">
                  <label>Full Name *</label>

                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>

                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="form-group">
                  <label>Blood Group *</label>

                  <select
                    name="bloodGroup"
                    value={editForm.bloodGroup}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select Blood Group</option>

                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City / Location *</label>

                  <input
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Available for Donation?</label>

                  <select
                    name="available"
                    value={editForm.available}
                    onChange={handleEditChange}
                  >
                    <option value="Yes">Yes, Available</option>
                    <option value="No">No, Not Available</option>
                  </select>
                </div>

              </div>

              <div className="form-notice">
                <ShieldCheck size={22} />

                <p>
                  Only the profile fields shown here will be updated.
                  Private medical information will remain unchanged.
                </p>
              </div>

              <div className="contact-buttons">

                <button
                  className="submit-btn"
                  type="submit"
                  disabled={updating}
                >
                  <Save size={18} />
                  {updating ? "Updating..." : "Save Changes"}
                </button>

                <button
                  className="delete-btn"
                  type="button"
                  onClick={cancelEditing}
                  disabled={updating}
                >
                  <X size={18} />
                  Cancel
                </button>

              </div>

            </form>

          )}

          {loading ? (

            <div className="empty-state">
              <p>Loading donors...</p>
            </div>

          ) : error ? (

            <div className="empty-state">
              <h3>Unable to Load Donors</h3>
              <p>{error}</p>

              <button
                className="primary-btn"
                onClick={fetchDonors}
              >
                Try Again
              </button>
            </div>

          ) : filteredDonors.length === 0 ? (

            <div className="empty-state">

              <Droplet size={55} />

              <h3>No Donors Found</h3>

              <p>
                No matching donor is registered in this
                website's current database.
              </p>

              <button
                className="primary-btn"
                onClick={() => goTo("register")}
              >
                Register as Donor
              </button>

            </div>

          ) : (

            <div className="donor-grid">

              {filteredDonors.map((donor) => (

                <div
                  className="donor-card"
                  key={donor._id}
                >

                  <div className="donor-top">

                    <div className="donor-avatar">
                      {donor.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3>{donor.name}</h3>

                      <span className="available">
                        Available
                      </span>
                    </div>

                    <div className="blood-badge">
                      {donor.bloodGroup}
                    </div>

                  </div>

                  <div className="donor-info">

                    <p>
                      <MapPin size={17} />
                      {donor.location}
                    </p>

                    <p>
                      <Activity size={17} />
                      Registered donor
                    </p>

                  </div>

                  <div className="contact-buttons">

                    <a
                      className="call-btn"
                      href={`tel:${donor.phone}`}
                    >
                      <Phone size={16} />
                      Call
                    </a>

                    <button
                      className="whatsapp-btn"
                      onClick={() => openWhatsApp(
                        donor.phone,
                        `Hello ${donor.name}, I found your donor profile on LifeDrop. Are you available to donate ${donor.bloodGroup} blood?`
                      )}
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </button>

                    {donor.email && (
                      <a
                        className="email-btn"
                        href={`mailto:${donor.email}`}
                      >
                        <Mail size={16} />
                        Email
                      </a>
                    )}

                    <button
                      className="edit-btn"
                      onClick={() => startEditing(donor)}
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteDonor(donor._id)}
                    >
                      <X size={16} />
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

          <div className="medical-warning">

            <ShieldCheck size={22} />

            <p>
              A listed donor is not automatically medically
              eligible to donate. Hospitals must verify blood
              type, donor eligibility and blood compatibility
              through appropriate medical procedures.
            </p>

          </div>

        </section>

      )}

      {/* ABOUT PAGE */}

      {activePage === "about" && (

        <section className="page-section about-page">

          <div className="section-heading">

            <span>ABOUT LIFEDROP</span>

            <h2>Connecting People. Saving Lives.</h2>

          </div>

          <div className="about-content">

            <div>
              <h3>Our Mission</h3>

              <p>
                LifeDrop aims to connect blood donors with
                patients, hospitals and communities worldwide.
                We believe that finding a potential blood donor
                should be easier, faster and more accessible.
              </p>
            </div>

            <div>
              <h3>Our Vision</h3>

              <p>
                We want to create a worldwide community where
                people can register as blood donors and help
                others during emergencies.
              </p>
            </div>

          </div>

        </section>

      )}

      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-content">

          <div className="footer-brand">

            <div className="logo">

              <div className="logo-icon">
                <Droplet size={23} fill="white" />
              </div>

              <span>
                Life<span className="red">Drop</span>
              </span>

            </div>

            <p>
              Every drop counts. Together, we can make
              a difference and save lives.
            </p>

          </div>

          <div>

            <h3>Quick Links</h3>

            <button onClick={() => goTo("home")}>
              Home
            </button>

            <button onClick={() => goTo("donors")}>
              Find Donors
            </button>

            <button onClick={() => goTo("register")}>
              Register
            </button>

          </div>

          <div>

            <h3>Contact Us</h3>

            <button onClick={contactOwner}>
              WhatsApp Support
            </button>

            <p>Helping people worldwide.</p>

          </div>

        </div>

        <div className="copyright">

          © {new Date().getFullYear()} LifeDrop.
          All Rights Reserved.

        </div>

      </footer>

      {/* FLOATING WHATSAPP BUTTON */}

      <button
        className="floating-whatsapp"
        onClick={contactOwner}
        aria-label="Contact website owner on WhatsApp"
        title="Contact us on WhatsApp"
      >
        <MessageCircle size={29} />
        <span>Contact Us</span>
      </button>

    </div>
  );
}

export default App;
