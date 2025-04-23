import React from 'react';
import CreateProjectForm from '../../components/Projects/CreateProjectForm';
import styles from './CreateProject.module.scss';

const CreateProject: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <CreateProjectForm />
    </div>
  );
};

export default CreateProject; 