import { useRef } from 'react';
import Spinner from '../Layout/Spinner';

import FileList from './FileList';

const Main = props => {
  const fileDescription = useRef();
  
  const submitHandler = (event) => {
    event.preventDefault();

    props.uploadFile(fileDescription.current.value);
  };
  
  return (
    <div className="container-fluid text-center mt-3">
      <div className="row justify-content-md-center">
        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
          <div className="content">            
            <div className="card mb-3 mx-auto bg-secondary" style={{ maxWidth: '512px' }}>
              <h2 className="text-white text-monospace bg-secondary"><b>Share File</b></h2>
                <form onSubmit={submitHandler} >
                    <div className="form-group">                      
                      <input
                        id="fileDescription"
                        type="text"
                        ref={fileDescription}
                        className="form-control text-monospace"
                        placeholder="File description..."
                        required 
                      />
                    </div>
                  <input type="file" onChange={props.captureFile} className="text-white text-monospace mt-2"/>
                  <button type="submit" className="btn-primary btn-block col-12 mt-2"><b>UPLOAD</b></button>
                </form>
            </div>
            <p>&nbsp;</p>
              {!props.isLoading && <table className="table table-sm" >
                <thead style={{ 'fontSize': '15px' }}>
                  <tr className="bg-secondary text-white">
                    <th scope="col" style={{ width: '10px'}}>Id</th>
                    <th scope="col" style={{ width: '200px'}}>Name</th>
                    <th scope="col" style={{ width: '230px'}}>Description</th>
                    <th scope="col" style={{ width: '120px'}}>Type</th>
                    <th scope="col" style={{ width: '90px'}}>Size</th>
                    <th scope="col" style={{ width: '90px'}}>Date</th>
                    <th scope="col" style={{ width: '120px'}}>Uploader/view</th>
                    <th scope="col" style={{ width: '120px'}}>Hash/View/Get</th>
                  </tr>
                </thead>
                <FileList files={props.files} />
              </table>}
            {props.isLoading && <Spinner />}
          </div>
        </main>
      </div>
    </div>
  );
  
};

export default Main;