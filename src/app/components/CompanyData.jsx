import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const CompanyData = ({ data, emailTypes }) => {
  const [emails, setEmails] = useState(data.emails || []);
  const [deleteEmails, setDeleteEmails] = useState([]);

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index].email = value;
    setEmails(updated);
  };

  const handleEmailTypeChange = (index, typeId) => {
    const updated = [...emails];
    updated[index].type = { ...updated[index].type, _id: typeId };
    setEmails(updated);
  };

  const handleAddEmail = () => {
    setEmails([...emails, { email: "", type: { _id: "" } }]);
  };

  const handleRemoveEmail = (index) => {
    const toRemove = emails[index]; // ← captura ANTES de setEmails

    setEmails((prev) => prev.filter((_, i) => i !== index));

    if (toRemove && toRemove._id) {
      setDeleteEmails((prev) => [...prev, toRemove]);
    }
  };

  const handlePrintOutput = () => {
    const output = {
      id: data._id,
      email: data.email,
      emails,
      deleteEmails,
    };

    try {
      const response = fetch(
        "https://faculdadeunimed.sydle.one/api/1/main/br.edu.faculdadeUnimed.integracao/FachadaDeIntegracaoPortalDeNotas/updateEmail",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${process.env.NEXT_PUBLIC_PROD_KEY}`,
            "User-Agent": "insomnia/10.3.0",
          },
          cache: "no-store",
          body: JSON.stringify(output),
        }
      );

      const result = response
      console.log("Dados da API:", result);
    } catch (err) {
      console.error("Erro ao enviar dados:", err);
    } finally {
      console.log("Dados enviados com sucesso!");
    }
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
          <p className="text-lg font-semibold text-gray-700 mb-2">
            Emails Registrados:
          </p>

          <div className="flex flex-col gap-4">
            {emails.map((emailObj, index) => {
              const isPrincipal =
                emailObj.type?._id === "59122c36116a1f1dccc704b9";
              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-3 items-start md:items-center p-3 rounded-md border ${
                    isPrincipal
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200"
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
                    onChange={(e) =>
                      handleEmailTypeChange(index, e.target.value)
                    }
                    className="w-full md:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Selecione o tipo
                    </option>
                    {emailTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
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
    </div>
  );
};

export default CompanyData;
