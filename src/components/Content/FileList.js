import moment from 'moment';

import { convertBytes } from '../../utils';

const FileList = props => {
  return(
    props.files.map((file, key) => {
      return(
        <tbody style={{ 'fontSize': '14px' }} key={key}>
          <tr>
            <td>{file.fileId}</td>
            <td>{file.fileName}</td>
            <td>{file.fileDescription}</td>
            <td>{file.fileType}</td>
            <td>{convertBytes(file.fileSize)}</td>
            <td>{moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}</td>
            <td>
              <a
                href={"https://etherscan.io/address/" + file.uploader}
                rel="noopener noreferrer"
                target="_blank">
                {file.uploader.substring(0,10)}...
              </a>
              </td>
            <td>
              <a
                href={"https://ipfs.infura.io/ipfs/" + file.fileHash}
                rel="noopener noreferrer"
                target="_blank">
                {file.fileHash.substring(0,10)}...
              </a>
            </td>
          </tr>
        </tbody>
      );
    })
  );  
};

export default FileList;

