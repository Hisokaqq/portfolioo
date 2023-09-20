import { useNavigate, useParams } from 'react-router-dom'
import Example from '../components/Example'
import { motion } from 'framer-motion'
import {VscGithubAlt} from 'react-icons/vsc'
import {SiVercel} from 'react-icons/si'
import projects from '../components/projects'

const SingleProject = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const project = projects.find((p) => p.id === Number(id))
    const goBack = () => {
        navigate("/projects");
    }
    return (
        <motion.div animate={{opacity: 1, transition:{duration:1.3}}} initial={{opacity:0}} exit={{opacity:0}}  className='example-cont bg-black'>

            <div className="fixed top-0 left-0 ">
                <p onClick={goBack}  className="font-bold p-3 text-lg text-white hover:text-gray-400 duration-300">  Go Back </p>
            </div>
            <div className='fixed top-0 right-0 flex gap-5 p-3 z-50'>

                <VscGithubAlt onClick={()=>window.open(project.urlgit)}  color="white" fill="white" className="cursor-pointer text-3xl md:text-[2rem]"/>
                {project.urlvercel &&  <SiVercel onClick={()=>window.open(project.urlvercel)}  color="white" fill="white" stroke="white" className="cursor-pointer text-3xl md:text-[2rem] "/>}
            </div>
            <Example images={project.images}/>

        </motion.div>
            
  )
}

export default SingleProject