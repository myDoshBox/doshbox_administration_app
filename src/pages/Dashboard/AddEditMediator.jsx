// src/pages/Admin/Mediators/AddEditMediator.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  useCreateMediatorMutation,
  useUpdateMediatorMutation,
  useGetMediatorByIdQuery,
} from "../../Redux/Slice/AdminMeditor/mediatorApiSlice";
import Alert from "../../component/tools/Alert";

const AddEditMediator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    mediator_email: "",
    mediator_phone_number: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { data: mediatorData, isLoading } = useGetMediatorByIdQuery(id, {
    skip: !isEditMode,
  });

  const [createMediator, { isLoading: isCreating }] =
    useCreateMediatorMutation();
  const [updateMediator, { isLoading: isUpdating }] =
    useUpdateMediatorMutation();

  React.useEffect(() => {
    if (isEditMode && mediatorData) {
      const mediator = mediatorData.data.mediator;
      setFormData({
        first_name: mediator.first_name || "",
        middle_name: mediator.middle_name || "",
        last_name: mediator.last_name || "",
        mediator_email: mediator.mediator_email || "",
        mediator_phone_number: mediator.mediator_phone_number || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [isEditMode, mediatorData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.mediator_email.trim()) {
      newErrors.mediator_email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.mediator_email)) {
      newErrors.mediator_email = "Email is invalid";
    }

    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const submitData = { ...formData };
      delete submitData.confirmPassword;

      if (isEditMode) {
        await updateMediator({ id, ...submitData }).unwrap();
        setAlertMessage("Mediator updated successfully!");
      } else {
        await createMediator(submitData).unwrap();
        setAlertMessage("Mediator created successfully!");
      }

      setShowAlert(true);
      setTimeout(() => {
        navigate("/admin/mediators");
      }, 2000);
    } catch (error) {
      setAlertMessage(error.data?.message || "An error occurred");
      setShowAlert(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/mediators")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Mediators
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Edit Mediator" : "Add New Mediator"}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditMode
            ? "Update mediator information"
            : "Add a new mediator to the platform"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.first_name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="John"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Michael"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.last_name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Doe"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="mediator_email"
                value={formData.mediator_email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.mediator_email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="john@example.com"
              />
              {errors.mediator_email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.mediator_email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="mediator_phone_number"
                value={formData.mediator_phone_number}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>
          </div>

          {!isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/mediators")}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : isEditMode
                    ? "Update Mediator"
                    : "Create Mediator"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {showAlert && (
        <Alert
          variant={alertMessage.includes("success") ? "success" : "destructive"}
        >
          {alertMessage}
        </Alert>
      )}
    </div>
  );
};

export default AddEditMediator;
