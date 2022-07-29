import {IMaskInput} from "react-imask"
import {useFormik} from "formik"
import { FormStyle } from "../person.styled"
import { useContextPeople } from "../../../hooks/useContextPeople"
import { Button } from "../../../components/button/Button.styled"

export const FormPeople = ({isUpdate, personDatasUpdate}) => {
  const {handleUpdatePerson, handleCreatePerson} = useContextPeople()

  const formik = useFormik(
    {initialValues: {nome: "", dataNascimento: "", cpf: "", email: "", idPessoa: ""}, 
    onSubmit: async values => {
      isUpdate ? await handleUpdatePerson(values) : await handleCreatePerson(values) 
      formik.resetForm({values: { nome: "", dataNascimento: "", cpf: "", email: "", idPessoa: ""}})
    }})

  return (
    <FormStyle onSubmit={formik.handleSubmit}>
      <h2>{!isUpdate ? "Cadastrar pessoas" : "Atualizar"}</h2>
      
      <div>
        <label htmlFor="nome">Nome</label>
        <input name="nome" id="nome" placeholder="Digite o nome da pessoa" onChange={formik.handleChange} value={formik.values.nome}/>
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Digite o email" onChange={formik.handleChange} value={formik.values.email}/>
      </div>
      <div>
        <label htmlFor="cpf">Cpf</label>
        <IMaskInput mask="000.000.000-00" name="cpf" id="cpf" placeholder="Digite o cpf" onChange={formik.handleChange} value={formik.values.cpf}/>
      </div>
      <div>
        <label htmlFor="data">Data nascimento</label>
        <input type="date" name="dataNascimento" id="dataNascimento" onChange={formik.handleChange} value={formik.values.dataNascimento} />
      </div>
      <Button width="50%" type="submit">{!isUpdate ? "Cadastrar" : "Atualizar"}</Button>
    </FormStyle>
  )
}
