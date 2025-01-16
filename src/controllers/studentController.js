const { ObjectId } = require('mongodb');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

// Create a Student
async function createStudent(req, res) {
  try {
    const { name, CNE, age } = req.body;

    if (!name || !CNE || !age) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const existingStudent = await mongoService.findOneByField('students', { CNE });
    if (existingStudent) {
      return res.status(409).json({ message: 'Un étudiant avec cet CNE existe déjà.' });
    }

    const newStudent = await mongoService.createStudent({ name, CNE, age });

    const cacheKey = `student:${newStudent._id}`;
    await redisService.cacheData(cacheKey, newStudent, 3600);

    return res.status(201).json(newStudent);
  } catch (error) {
    console.error('Erreur lors de la création de l\'étudiant:', error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}

// Get one Student
async function getStudent(req, res) {
  try {
    const { id } = req.params;

    const student = await mongoService.findOneById('student', id);

    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé.' });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'étudiant:', error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}

// Get all Students
async function getAllStudents(req, res) {
  try {
    const students = await mongoService.findAll('student');
    return res.status(200).json(students);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des étudiants.' });
  }
}

// Update a Student
async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { name, CNE, age } = req.body;

    if (!name && !CNE && !age) {
      return res.status(400).json({ message: 'Au moins un champ est requis pour la mise à jour.' });
    }

    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (CNE) updatedFields.email = CNE;
    if (age) updatedFields.age = age;

    const updatedStudent = await mongoService.updateOneById('student', id, updatedFields);

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Étudiant non trouvé.' });
    }

    return res.status(200).json({ message: 'Étudiant mis à jour avec succès.', updatedStudent });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'étudiant:', error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}

// Delete a Student
async function deleteStudent(req, res) {
  try {
    const { id } = req.params;

    const deletedStudent = await mongoService.deleteOneById('student', id);

    if (!deletedStudent) {
      return res.status(404).json({ message: 'Étudiant non trouvé.' });
    }

    return res.status(200).json({ message: 'Étudiant supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étudiant:', error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}

// Export controlers
module.exports = {
  createStudent,
  getStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
};
