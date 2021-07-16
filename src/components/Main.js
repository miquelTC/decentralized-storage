import { useRef } from 'react';

import FileList from './FileList';

const Main = props => {
  const fileDescription = useRef();
  
  const submitHandler = (event) => {
    event.preventDefault();

    props.uploadFile(fileDescription.value);
  };
  
  return (
    <div className="container-fluid mt-5 text-center">
      <div className="row">
        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
          <div className="content">
            <p>&nbsp;</p>
            <div className="card mb-3 mx-auto bg-dark" style={{ maxWidth: '512px' }}>
              <h2 className="text-white text-monospace bg-dark"><b><ins>Share File</ins></b></h2>
                <form onSubmit={submitHandler} >
                    <div className="form-group">
                      <br></br>
                        <input
                          id="fileDescription"
                          type="text"
                          ref={fileDescription}
                          className="form-control text-monospace"
                          placeholder="Description..."
                          required />
                    </div>
                  <input type="file" onChange={props.captureFile} className="text-white text-monospace"/>
                  <button type="submit" className="btn-primary btn-block"><b>Upload!</b></button>
                </form>
            </div>
            <p>&nbsp;</p>
            <table className="table-sm table-bordered text-monospace" style={{ width: '1000px', maxHeight: '450px'}}>
              <thead style={{ 'fontSize': '15px' }}>
                <tr className="bg-dark text-white">
                  <th scope="col" style={{ width: '10px'}}>id</th>
                  <th scope="col" style={{ width: '200px'}}>name</th>
                  <th scope="col" style={{ width: '230px'}}>description</th>
                  <th scope="col" style={{ width: '120px'}}>type</th>
                  <th scope="col" style={{ width: '90px'}}>size</th>
                  <th scope="col" style={{ width: '90px'}}>date</th>
                  <th scope="col" style={{ width: '120px'}}>uploader/view</th>
                  <th scope="col" style={{ width: '120px'}}>hash/view/get</th>
                </tr>
              </thead>
              <FileList files={props.files} />
            </table>
          </div>
        </main>
      </div>
    </div>
  );
  
};

export default Main;