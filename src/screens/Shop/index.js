import React from "react";
import { connect } from "react-redux";
import "./index.css";
import Firebase from "../../firebasehelper";
import Header from "../components/Header";
import ProfileModal from "../../Components/ProfileModal";
import SubscriptionModal from "../../Components/SubscriptionModal";
import TimelineModal from "../../Components/TimelineModal";
import { removeAll } from "../../redux/actions";
import Package from "../../Components/Package";
class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      loading: true,
      brand_logo: ""
    };
  }
  componentDidMount() {
    const { uid, profile, brand } = this.props;
    if (!uid) this.props.history.push("/");
    console.log("brand", brand);
    Firebase.getBoltPackages(res => {
      let brand_logo = brand.logo;
      let bolt_packages = Object.values(res);
      let brand_packages = [];
      let array = [];
      bolt_packages.map(item => {
        const { order } = item;
        array[order] = item;
      });
      bolt_packages = array;
      console.log("bolt packages", bolt_packages);
      if (brand.packages) {
        brand_packages = Object.values(brand.packages);
      }
      array = [];
      brand_packages.map(item => {
        const { order } = item;
        array[order] = item;
      });
      brand_packages = array;
      console.log("brand_packages", brand_packages);
      let packages = bolt_packages.concat(brand_packages);
      console.log("packages", packages);
      this.setState({ loading: false, packages, brand_logo });
    });
  }
  showPackages = () => {
    let { packages } = this.state;
    const { profile } = this.props;
    console.log("packages inside ShowPackages", packages);
    return packages.map((item, index) => {
      const { visibility } = item;
      if (visibility)
        return <Package id={index} data={item} profile={profile} />;
    });
  };
  signOut = () => {
    localStorage.removeItem("uid");
    localStorage.removeItem("profile");
    localStorage.removeItem("brand");
    this.props.dispatch(removeAll());
    this.props.history.push("/");
  };
  render() {
    const { profile } = this.props;
    const { loading, brand_logo } = this.state;
    return (
      <div id="page-container">
        <Header signOut={this.signOut} screen="shop" />
        <main id="main-container">
          <div className="div_content">
            {loading && <i class="fa fa-4x fa-sync fa-spin text-muted" />}
            {!loading && this.showPackages()}
          </div>
        </main>
        <ProfileModal />
        <SubscriptionModal />
        <TimelineModal />
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch
  };
}
function mapStateToProps(state) {
  return {
    uid: state.uid,
    profile: state.profile,
    brand: state.brand
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Shop);
