import { useNavigate, useParams } from 'react-router-dom'
import Example from '../components/Example'
import { motion } from 'framer-motion'
import {VscGithubAlt} from 'react-icons/vsc'
import {SiVercel} from 'react-icons/si'
import projects from '../components/projects'
import GBackBtn from '../components/GBackBtn'
import { pageVariants } from '../helpers/AnimationVar'

const SingleProject = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const project = projects.find((p) => p.id === Number(id))
    const goBack = () => {
        navigate("/projects");
    }

    if (!project) {
        return (
            <div className="example-cont bg-black flex-col gap-4">
                <GBackBtn goBack={goBack} onDark />
                <p className="text-white text-lg">Project not found.</p>
            </div>
        )
    }

    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className='example-cont bg-black'>
            <GBackBtn goBack={goBack} onDark />
            <div className='fixed top-0 right-0 flex gap-5 p-3 z-50 items-center'>
                <a href={project.urlgit} target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub">
                    <VscGithubAlt color="white" fill="white" className="cursor-pointer text-3xl md:text-[2rem]"/>
                </a>
                {project.urlvercel && <a href={project.urlvercel} target="_blank" rel="noopener noreferrer" aria-label="View live demo on Vercel">
                    <SiVercel color="white" fill="white" stroke="white" className="cursor-pointer text-3xl md:text-[2rem]"/>
                </a>}
            </div>
            <Example images={project.images}/>
        </motion.div>
            
  )
}

export default SingleProject