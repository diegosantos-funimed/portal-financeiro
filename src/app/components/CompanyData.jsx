import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const CompanyData = ({ data, emailTypes }) => {
  const [emails, setEmails] = useState(data.emails || []);
  const [deleteEmails, setDeleteEmails] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index].email = value;
    setEmails(updated);
  };

  const handleEmailTypeChange = (index, typeId) => {
    const updated = emails.map((emailObj, i) => {
      if (i === index) {
        return { ...emailObj, type: { ...emailObj.type, _id: typeId } };
      }
      if (typeId === "59122c36116a1f1dccc704b9" && emailObj.type?._id === "59122c36116a1f1dccc704b9") {
        return { ...emailObj, type: { ...emailObj.type, _id: "" } };
      }
      return emailObj;
    });

    setEmails(updated);
  };

  const handleAddEmail = () => {
    setEmails([...emails, { email: "", type: { _id: "" } }]);
  };

  const handleRemoveEmail = (index) => {
    const toRemove = emails[index];
    setEmails((prev) => prev.filter((_, i) => i !== index));

    if (toRemove && toRemove._id) {
      setDeleteEmails((prev) => [...prev, toRemove]);
    }
  };

  const handlePrintOutput = async () => {
    const output = {
      id: data._id,
      email: data.email,
      emails,
      deleteEmails,
    };

    try {
      const response = await fetch(
        "https://faculdadeunimed.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/updateEmail",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${process.env.NEXT_PUBLIC_PROD_KEY}`,
            "User-Agent": "insomnia/10.3.0",
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify(output),
        }
      );

      const result = await response.json();
      console.log("Dados da API:", result);
      if (result?._singleValue === "Usuário atualizado") {
        setOpenModal(true);
      }
    } catch (err) {
      console.error("Erro ao enviar dados:", err);
    } finally {
      console.log("Dados enviados com sucesso!");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="shadow-lg p-6 rounded-xl mt-6 bg-white border border-gray-200">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Dados da Empresa
        </h2>

        <div className="text-lg space-y-2">
          <p>
            <strong>Nome:</strong> {data.name}
          </p>
          <p>
            <strong>CNPJ:</strong> {data.documents[0]?.number}
          </p>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700 mb-1">
            Emails Registrados:
          </p>
          <p className="mb-2">
            <small>É possível ter apenas um email principal e varios secundários</small>
          </p>

          <div className="flex flex-col gap-4">
            {emails.map((emailObj, index) => {
              const isPrincipal = emailObj.type?._id === "59122c36116a1f1dccc704b9";
              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-3 items-start md:items-center p-3 rounded-md border ${isPrincipal ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
                    }`}
                >
                  <input
                    type="email"
                    value={emailObj.email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    className="w-full md:w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="exemplo@empresa.com"
                  />

                  <select
                    value={(emailObj?.type && emailObj.type._id) || ""}
                    onChange={(e) => handleEmailTypeChange(index, e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Selecione o tipo
                    </option>
                    {emailTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type._source.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemoveEmail(index)}
                    className="text-red-600 hover:text-red-800 border p-1 rounded-md hover:cursor-pointer"
                    disabled={isPrincipal}
                    title="Remover Email"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddEmail}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <AddIcon /> Adicionar Email
            </button>

            <button
              onClick={handlePrintOutput}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition hover:cursor-pointer"
            >
              📤 Atualizar dados
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm" // aumenta o tamanho padrão do dialog (xs, sm, md, lg, xl)
        className="rounded-md shadow-lg"
      
      >
        <DialogTitle
          className="bg-green-500 text-white text-xl font-semibold px-6 py-4"
        >
          🎉 Sucesso
        </DialogTitle>

        <DialogContent className="px-6 py-4 mt-5">
          <DialogContentText className="text-gray-700 text-lg">
            Usuário atualizado com sucesso!
          </DialogContentText>
        </DialogContent>

        <DialogActions className="px-6 pb-4">
          <Button
            onClick={handleCloseModal}
            variant="contained"
            color="success"
            className="rounded-md"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default CompanyData;
