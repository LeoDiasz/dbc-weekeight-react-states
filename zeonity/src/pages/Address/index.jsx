import {Formik} from "formik"
import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import { maskCep } from "../../utils/masks"
import { api } from "../../services/api"
import { ContainerPagesWithSideBar } from "../../components/ContainerPagesWithSideBar"
import { useContextAddress } from "../../hooks/useContextAddress"
import { FormContent } from "../../components/FormContent/styles"
import { Button } from "../../components/Button/styles"
import { Label, Input, MaskInput, InputField } from "../../components/Input/styles"

export const Address = () => {
  const {id, idAddress} = useParams()
  const [isUpdate, setIsUpdate] = useState(false)

  const {handleCreateAddress , addressDatasUpdate, handleUpdateAddress, getAddressById} = useContextAddress()

  const searchDatasAddress = async (event, setFieldValue) => {
  
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
      await getAddressById(idAddress)
      setIsUpdate(true)
    } 
  } 

  useEffect(() => { 
      setup()
  }, [])

  useEffect(() => {

  }, [addressDatasUpdate])

  if(!addressDatasUpdate && isUpdate) {
    console.log(addressDatasUpdate)
    return
  }

  const addressDatas = addressDatasUpdate && addressDatasUpdate

  const isUpdateAndHasDatasAddress = addressDatas && isUpdate

 

  return (
    <ContainerPagesWithSideBar>
        {isUpdate ? <h1>Atualizar endereço</h1> : <h1>Criar endereço</h1>}
        <Formik
        initialValues={{
          idPessoa: parseInt(id),
          tipo: isUpdateAndHasDatasAddress &&   "",
          logradouro: isUpdateAndHasDatasAddress && "",
          numero: isUpdateAndHasDatasAddress &&  "",
          complemento: isUpdateAndHasDatasAddress &&  "",
          cep: isUpdateAndHasDatasAddress && "",
          cidade: isUpdateAndHasDatasAddress && "",
          estado: isUpdateAndHasDatasAddress && "",
          pais: isUpdateAndHasDatasAddress &&  "",
        }}

        onSubmit={async (values, resetForm) => {
            isUpdate ? await handleUpdateAddress(values, idAddress) : await handleCreateAddress(values, id)
            resetForm()
        }}>
          {({errors, values, handleChange, setFieldValue }) => (
            <FormContent>
              <div>
                <Label htmlFor="cep">Cep</Label>
                <MaskInput mask={maskCep} name="cep" id="cep" value={values.cep} onChange={handleChange} onBlur={event => searchDatasAddress(event, setFieldValue)} placeholder="Digite seu cep"/> 
                <div>{errors.cep}</div>
              </div>
          
              <div>
                <Label htmlFor="logradouro">Logradouro</Label>
                <InputField name="logradouro" id="logradouro" placeholder="Digite Seu logradouro"/>
                <div>{errors.logradouro}</div>
              </div>
            
              <div>
                <Label htmlFor="numero">Numero</Label>
                <Input name="numero" id="numero" placeholder="Digite Seu numero" type="number" value={values.numero} onChange={handleChange}/>
                <div>{errors.numero}</div>
              </div>
         
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <InputField name="complemento" id="complemento" placeholder="Digite Seu complemento"/>
                <div>{errors.complemento}</div>
              </div>
        
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <InputField name="cidade" placeholder="Digite Seu cidade"/>
                <div>{errors.cidade}</div>
              </div>
         
              <div>
                <Label htmlFor="estado">Estado</Label>
                <InputField name="estado" placeholder="Digite Seu estado"/>
                <div>{errors.estado}</div>
              </div>
         
              <div>
                <Label htmlFor="pais">Pais</Label>
                <Input name="pais" id="pais" placeholder="Digite Seu pais" value={values.pais} onChange={handleChange}/>
                <div>{errors.pais}</div>
              </div>
         
              <div>
                <Label htmlFor="tipo">Tipo</Label>
                <Input name="tipo" id="tipo" placeholder="Digite Seu tipo" value={values.tipo} onChange={handleChange}/>
                <div>{errors.tipo}</div>
              </div>
              <Button type="submit">{isUpdate ? "Atualizar endereço" : "Criar Endereço"}</Button>
            </FormContent>
          )}
      </Formik>
 
    </ContainerPagesWithSideBar>
  )
}
