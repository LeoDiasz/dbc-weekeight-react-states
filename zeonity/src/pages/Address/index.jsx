import {Formik} from "formik"
import {useEffect, useState} from "react"
import {useParams, useNavigate} from "react-router-dom"
import { maskCep } from "../../utils/masks"
import { AddressSchema } from "../../utils/validations"
import { api } from "../../services/api"
import { useContextAddress } from "../../hooks/useContextAddress"
import { ContainerPagesWithSideBar } from "../../components/ContainerPagesWithSideBar"
import { HeaderPages } from "../../components/HeaderPages/styles"
import { FormContent } from "../../components/FormContent/styles"
import { Button } from "../../components/Button/styles"
import { Label, MaskInput, InputField, SelectInput, TextValidation } from "../../components/Input/styles"
import { ContainerForFormAndLists } from "../../components/ContainerForFormAndLists/styles"

export const Address = () => {
  const {id} = useParams()
  const {idAddress} = useParams()
  const navigate = useNavigate()
  const [isUpdate, setIsUpdate] = useState(false)
  const [addressDatasUpdate, setAddressDatasUpdate] = useState()
  const {handleCreateAddress , handleUpdateAddress, getAddressById} = useContextAddress()

  const searchDatasAddressViaCep = async (event, setFieldValue) => {
  
    const cep = event.target.value
    const newCep = cep.replace(/[^0-9]/gi, "");
  
    if(newCep.length !== 8) {
      return
    }
    
    try {
      const {data: result} = await api.get(`https://viacep.com.br/ws/${newCep}/json/`)
      
      setFieldValue("cidade", result.localidade)
      setFieldValue("estado", result.uf)
      setFieldValue("complemento", result.complemento)
      setFieldValue("logradouro", result.logradouro)
  
    } catch(error) {
      console.log(error)
    }
    
  }
  
  const setup = async () => {
    if (id && idAddress) {
      setIsUpdate(true)

      try {
        await getAddressById(idAddress, setAddressDatasUpdate)
      } catch(Error) {
        console.log(Error)
      }
    }
  } 

  useEffect(() => { 
      setup()
  }, [])

  useEffect(() => {

  }, [addressDatasUpdate])

  if(!addressDatasUpdate && isUpdate) {
    return
  }

  const addressDatas = addressDatasUpdate && addressDatasUpdate

  return (
    <ContainerPagesWithSideBar gap="30px">
      <HeaderPages justifyContent="flex-end" >
        <Button onClick={event => navigate(`/people/perfil/${id}`)}>Voltar</Button>
      </HeaderPages>

      <ContainerForFormAndLists display="flex" direction="column" gap="30px">
        <h2>{isUpdate ? "Atualizar endereço" : "Criar endereço" }</h2>
        <Formik
          initialValues={{
            idPessoa: parseInt(id),
            tipo: addressDatas && isUpdate ? addressDatas.tipo : "RESIDENCIAL",
            logradouro: addressDatas && isUpdate ? addressDatas.logradouro : "",
            numero: addressDatas && isUpdate ? addressDatas.numero : "",
            complemento: addressDatas && isUpdate ? addressDatas.complemento : "",
            cep: addressDatas && isUpdate ? addressDatas.cep : "",
            cidade: addressDatas && isUpdate ? addressDatas.cidade : "",
            estado: addressDatas && isUpdate ? addressDatas.estado : "",
            pais: addressDatas && isUpdate ? addressDatas.pais : "",
          }}
          validationSchema={AddressSchema}
          onSubmit={async (values, {resetForm}) => {
              isUpdate ? await handleUpdateAddress(values, idAddress, id) : await handleCreateAddress(values, id)
              resetForm()
          }}>
            {({errors, values, handleChange, setFieldValue }) => (
              <FormContent>
                <div>
                  <Label htmlFor="cep">Cep *</Label>
                  <MaskInput mask={maskCep} name="cep" id="cep" value={values.cep} onChange={handleChange} onBlur={event => searchDatasAddressViaCep(event, setFieldValue)} placeholder="Digite seu cep"/> 
                  <TextValidation>{errors.cep}</TextValidation>
                </div>
            
                <div>
                  <Label htmlFor="logradouro">Logradouro *</Label>
                  <InputField name="logradouro" id="logradouro" placeholder="Digite Seu logradouro"/>
                  <TextValidation>{errors.logradouro}</TextValidation>
                </div>
              
                <div>
                  <Label htmlFor="numero">Numero *</Label>
                  <InputField name="numero" id="numero" placeholder="Digite Seu numero"/>
                  <TextValidation>{errors.numero}</TextValidation>
                </div>
          
                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <InputField name="complemento" id="complemento" placeholder="Digite Seu complemento (opicional)"/>
                  <TextValidation>{errors.complemento}</TextValidation>
                </div>
          
                <div>
                  <Label htmlFor="cidade">Cidade *</Label>
                  <InputField name="cidade" placeholder="Digite Seu cidade"/>
                  <TextValidation>{errors.cidade}</TextValidation>
                </div>
          
                <div>
                  <Label htmlFor="estado">Estado *</Label>
                  <InputField name="estado" placeholder="Digite Seu estado"/>
                  <TextValidation>{errors.estado}</TextValidation>
                </div>
          
                <div>
                  <Label htmlFor="pais">País *</Label>
                  <InputField name="pais" id="pais" placeholder="Digite Seu país"/>
                  <TextValidation>{errors.pais}</TextValidation>
                </div>
          
                <div>
                  <Label htmlFor="tipo">Tipo *</Label>
                  <SelectInput name="tipo" id="tipo"  value={values.tipo} onChange={handleChange}>
                    <option value="RESIDENCIAL">residencial</option>
                    <option value="COMERCIAL">comercial</option>
                  </SelectInput>
                  <TextValidation>{errors.tipo}</TextValidation>
                </div>
                <Button type="submit" disabled={Object.values(errors).length > 0}>{isUpdate ? "Atualizar endereço" : "Criar Endereço"}</Button>
              </FormContent>
            )}
        </Formik>
      </ContainerForFormAndLists>
    </ContainerPagesWithSideBar>
  )
}
