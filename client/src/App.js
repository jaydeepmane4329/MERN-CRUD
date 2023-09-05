import './App.css';
import { useEffect, useState } from 'react';
import axios from "axios";
import Form from './components/Form';
// import { BsFillArrowDownCircleFill } from "react-icons/md"

let disable = true;
axios.defaults.baseURL = "http://localhost:8080/"
function App() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addSection, setAddSection] = useState(false)
  const [editSection, setEditSection] = useState(false);
  // const [image, setImage] = useState('');
  const [formData, setFormData] = useState({
    employee: "",
    name: "",
    email: "",
    photo: "",
    phoneNumber: "",
    birthDate: "",
  })
  const [formEditData, setFormEditData] = useState({
    employee: "",
    name: "",
    email: "",
    photo: "",
    phoneNumber: "",
    birthDate: "",
    _id: "",
  })
  // const [dataList, setDataList] = useState([]);

  const handleImage = (e) => {
    let url
    console.log(e.target);
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event) => {
        url = reader.result;
        // setImage(url);
        if (e.target.files[0].type === "image/jpeg") {
          disable = true;
          setFormData(prevValue => {
            return ({
              ...prevValue,
              'photo': url
            })
          });
        } else {
          alert("it should be image only")
          disable = false;
        }
      }
    }
  }

  // To handle newly created  data
  const handleChange = (e) => {
    console.log(e.target);
    const { value, name } = e.target
    setFormData((prevValue) => {
      return ({
        ...prevValue,
        [name]: value
      })
    })
  }

  // To handle submitted data
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const data = await axios.post("/create", formData)
      if (data.data.success) {
        setAddSection(false);
        alert(data.data.message);
        fetchData();
        setFormData({
          employee: "",
          name: "",
          email: "",
          photo: "",
          phoneNumber: "",
          birthDate: "",
        });
      }
    } catch (error) {
      console.log("Error in Submitting a form:", error)
    }
  }

  // To handle csv file
  const importFile = async (e) => {
    try {
      const file = e.target.files[0];
      let formData = new FormData();
      formData.append('file', file)
      if (file?.type === 'text/csv' && !(file.size > 15 * 1024 * 1024)) {
        await axios.post("/employeeImport", formData);
        alert("CSV Imported Successfully")
        fetchData();
      } else if (!(file?.type === 'text/csv')) {
        alert("it can be only a csv file")
      } else if (file?.type === 'text/csv' && file.size > 15 * 1024 * 1024) {
        alert("file size should be less than 15mb")
      }
      e.target.value = "";
    } catch (error) {
      console.log(error)
    }
  };

  // To fetch the data existing in data base.
  const fetchData = async (e) => {
    try {
      const data = await axios.get(`/?page=${currentPage}`);
      setItems(data.data.items);
      setTotalPages(data.data.totalPages);

      var reader = new FileReader();
      reader.readAsDataURL(data.data.data[13].photo);
      reader.onload = (event) => {
        let url = reader.result;
        console.log(url);
      }
      if (data.data.success) {
        // setDataList(data.data.data)
      }
    } catch (error) {
      console.log("Error in Featching the data:", error)
    }
  }

  // to export employees
  const exportFile = async () => {
    const data = await axios.get('/employeeExport');
    if (data.status === 200) {
      console.log(data);
      window.open(data.data.downloadUrl, "blank");
      fetchData();
      alert("Exported Successfully")
    } else {
      console.log("error");
    }
  }

  // To delete the data
  const deleteData = async (id) => {
    try {
      const data = await axios.delete("/delete/" + id);
      alert(data.data.message);
      fetchData();
    } catch (error) {
      console.log("Error in deleting the data:", error)
    }
  }

  // To update the data
  const updateData = async (e) => {
    try {
      e.preventDefault();
      const data = await axios.put("/update", formEditData);
      if (data.data.success) {
        setEditSection(false);
        alert(data.data.message);
        fetchData();
      }
    } catch (error) {
      console.log("Error in updating the data:", error)
    }
  }

  // To handle updated data 
  const handleEditOnChange = async (e) => {
    const { value, name } = e.target
    setFormEditData((prevValue) => {
      return ({
        ...prevValue,
        [name]: value
      })
    })
  }

  const handleImageInEditMode = (e) => {
    let url
    console.log(e.target);
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event) => {
        url = reader.result;
        // setImage(url);
        if (e.target.files[0].type === "image/jpeg") {
          disable = true;
          setFormEditData(prevValue => {
            return ({
              ...prevValue,
              'photo': url
            })
          });
        } else {
          alert("it should be image only")
          disable = false;
        }
      }
    }
  }
  // To handle editable form
  const handleEditableForm = (el) => {
    setFormEditData(el);
    setEditSection(true);
  }

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>Add</button>
        <button className='btn btn-add' onClick={exportFile}>Export</button>
        <label class="form-label btn btn-add" for="customFile">Upload CSV </label>
        <br />
        <input style={{ display: 'none' }} name='file' onChange={e => importFile(e)} className='btn btn-add' type="file" class="form-control" id="customFile" />


        {
          addSection && (
            <Form
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              handleClose={() => setAddSection(false)}
              rest={formData}
              handleImage={handleImage}
              disable={disable}
              editSection={editSection}
            />
          )
        }
        {
          editSection && (
            <Form
              handleSubmit={updateData}
              handleChange={handleEditOnChange}
              handleClose={() => setEditSection(false)}
              rest={formEditData}
              handleImage={handleImageInEditMode}
              disable={disable}
              editSection={editSection}
            />
          )
        }
        <div>
          <table>
            <thead>
              <tr>
                <th>Employee No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Photo</th>
                <th>Phone Number</th>
                <th>Birth Date</th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map(item => (

                  <tr key={item.id}>
                    <td>{item.employee}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>
                      <img style={{ display: item.photo ? 'inline' : 'none' }} alt='' src={item.photo} width="50px" height="50px" />
                      <br />
                      <a style={{ display: item.photo ? 'inline' : 'none' }} href={item.photo} class="donwload-btn" download="image">Download</a>
                    </td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.birthDate}</td>
                    <td>
                      <button className='btn btn-edit' onClick={() => handleEditableForm(item)}>Edit</button>
                      <button className='btn btn-delete' onClick={() => deleteData(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))) : (
                <p className='noData'>No Data</p>
              )
              }
            </tbody>
          </table>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous Page
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
        </div>
      </div >
    </>
  );
}

export default App;
