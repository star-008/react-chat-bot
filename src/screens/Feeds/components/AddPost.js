import React from "react";
import loadImage from "blueimp-load-image";
import { connect } from "react-redux";
import "./index.css";
class AddPost extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      img_content: "",
      description: "",
      content: ""
    };
  }
  componentDidMount() {}
  componentDidUpdate(prevProps) {}
  onChangeHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  selectedFile = e => {
    let _this = this;
    if (e.target.files && e.target.files[0]) {
      var content = e.target.files[0];
      loadImage.parseMetaData(content, function(data) {
        //default image orientation
        var orientation = 0;
        if (data.exif) {
          orientation = data.exif.get("Orientation");
        }
        loadImage(
          content,
          function(canvas) {
            var base64data = canvas.toDataURL("image/png");
            var img_src = base64data.replace(/^data\:image\/\w+\;base64\,/, "");
            _this.setState({ content: img_src });
            let img_content = "data:image/jpeg;base64," + img_src;
            _this.setState({ img_content });
          },
          {
            canvas: true,
            orientation: orientation
          }
        );
      });
    }
  };
  post = () => {
    const { onAdd } = this.props;
    const { content, description } = this.state;
    onAdd(content, description);
  };
  render() {
    const { img_content, description } = this.state;
    return (
      <div
        className="modal fade"
        id="post_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modal-default-fadein"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add your post</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                ref={button => (this.dismissElement = button)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body pb-1 content">
              <div className="form-group">
                <label htmlFor="example-text-input">Image</label>
                <input
                  type="file"
                  id="example-file-input"
                  name="example-file-input"
                  accept="image/*"
                  onChange={this.selectedFile}
                />
                {img_content && (
                  <div>
                    <img
                      src={img_content}
                      alt="post_img"
                      width="100%"
                      height="100%"
                    />
                  </div>
                )}
                <textarea
                  className="post_content"
                  name="description"
                  value={description}
                  placeholder="Input description here.."
                  onChange={this.onChangeHandler}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-light"
                data-dismiss="modal"
                onClick={this.post}
              >
                Post
              </button>
              <button
                type="button"
                className="btn btn-sm btn-light"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(AddPost);
