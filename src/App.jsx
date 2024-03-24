import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import toast from "react-hot-toast";

function App() {
  const [crud, setCrud] = useState([]);
  const [editItem, setEditItem] = useState(null); // State to track the item being edited
  console.log(editItem);
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const location = form.location.value;
    const message = form.message.value;
    const data = { name, email, location, message };

    try {
      if (editItem) {
        await axios.put(`http://localhost:5000/editInfo/${editItem._id}`, data);
        toast.success("Item updated successfully!");
        setEditItem(null);
        form.reset();
      } else {
        await axios.post("http://localhost:5000/addInfo", data);
        toast.success("Item added successfully!");
      }
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // Server responded with a status code outside of 2xx range
        console.error(
          "Server responded with error status:",
          error.response.status
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Request setup error:", error.message);
      }
      toast.error("An error occurred. Please try again later.");
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/allInfo");
      setCrud(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item); // Set the item to be edited
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/infoDelete/${id}`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="container mx-auto mt-5 px-2">
        <h1 className="text-5xl font-bold mb-12 text-center">Todo List</h1>
        <div className="md:flex  justify-center gap-6">
          <div className="md:w-1/2 w-full mx-auto">
            <form onSubmit={handleSubmit} className="">
              <input
                name="name"
                defaultValue={editItem ? editItem.name : ""}
                className="border border-sky-400 focus:outline-none py-4 px-4 w-full rounded-md mb-4 "
                type="text"
                placeholder="Enter your Name"
              />
              <input
                name="email"
                defaultValue={editItem ? editItem.email : ""}
                className="border border-sky-400 focus:outline-none py-4 px-4 w-full rounded-md mb-4 "
                type="email"
                placeholder="Enter your E-mail"
              />
              <input
                name="location"
                defaultValue={editItem ? editItem.location : ""}
                className="border border-sky-400 focus:outline-none py-4 px-4 w-full rounded-md mb-4 "
                type="text"
                placeholder="Enter your Location"
              />
              <textarea
                name="message"
                defaultValue={editItem ? editItem.message : ""}
                placeholder="Enter the Message"
                className="border border-sky-400 focus:outline-none py-4 px-4 w-full rounded-md mb-4 "
                type="text"
                cols={30}
                rows={5}
              />
              <div className="flex justify-center items-center mb-8">
                <button
                  type="submit"
                  className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 w-[150px] p-3 rounded-lg text-2xl text-white "
                >
                  {editItem ? "Update" : "Save"}
                </button>
                {editItem && ( // Show cancel button if editing
                  <button
                    type="button"
                    onClick={() => setEditItem(null)} // Cancel edit operation
                    className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 w-[150px] p-3 rounded-lg text-2xl text-white ml-4"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="md:w-1/2 w-full mx-auto h-full rounded-md  overflow-x-auto border p-1">
            <table className="table-auto w-full rounded-md">
              <thead className="bg-sky-100 border-b border-black rounded-t-md mb-4">
                <tr className="h-10 rounded-md">
                  <td>Name</td>
                  <td>Email</td>
                  <td>Location</td>
                  <td>Message</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody className="mb-4">
                {crud.map((item, index) => (
                  <tr key={index} className="border-b h-16">
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.location}</td>
                    <td>{item.message}</td>
                    <td className="flex h-16 items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-green-200 p-1 rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(item._id);
                        }}
                        className="bg-green-200 p-1 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
