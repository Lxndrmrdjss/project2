"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, RefreshCw, BookOpen, User, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

// Types
interface Student {
  id: string
  name: string
}

interface Subject {
  id: string
  name: string
}

interface Grade {
  studentId: string
  subjectId: string
  grade: number
}

interface StudentWithGrades {
  id: string
  name: string
  grades: {
    subjectId: string
    subjectName: string
    grade: number
  }[]
}

export default function Home() {
  // State
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [newStudent, setNewStudent] = useState({ id: "", name: "" })
  const [newSubject, setNewSubject] = useState({ id: "", name: "" })
  const [newGrade, setNewGrade] = useState({ studentId: "", subjectId: "", grade: 0 })
  const [aiAnalysis, setAiAnalysis] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { toast } = useToast()

  // Initialize with sample data
  useEffect(() => {
    // Sample subjects
    const initialSubjects = [
      { id: "MATH101", name: "Mathematics" },
      { id: "ENG101", name: "English" },
      { id: "SCI101", name: "Science" },
    ]

    // Sample students
    const initialStudents = [
      { id: "S001", name: "Alex Johnson" },
      { id: "S002", name: "Maria Garcia" },
      { id: "S003", name: "James Smith" },
    ]

    // Sample grades
    const initialGrades = [
      { studentId: "S001", subjectId: "MATH101", grade: 65 },
      { studentId: "S001", subjectId: "ENG101", grade: 78 },
      { studentId: "S001", subjectId: "SCI101", grade: 82 },
      { studentId: "S002", subjectId: "MATH101", grade: 92 },
      { studentId: "S002", subjectId: "ENG101", grade: 88 },
      { studentId: "S002", subjectId: "SCI101", grade: 95 },
      { studentId: "S003", subjectId: "MATH101", grade: 75 },
      { studentId: "S003", subjectId: "ENG101", grade: 70 },
      { studentId: "S003", subjectId: "SCI101", grade: 68 },
    ]

    setSubjects(initialSubjects)
    setStudents(initialStudents)
    setGrades(initialGrades)
  }, [])

  // Add new student
  const addStudent = () => {
    if (!newStudent.id || !newStudent.name) {
      toast({
        title: "Error",
        description: "Please enter both student ID and name",
        variant: "destructive",
      })
      return
    }

    if (students.some((s) => s.id === newStudent.id)) {
      toast({
        title: "Error",
        description: "Student ID already exists",
        variant: "destructive",
      })
      return
    }

    setStudents([...students, newStudent])
    setNewStudent({ id: "", name: "" })
    toast({
      title: "Success",
      description: "Student added successfully",
    })
  }

  // Add new subject
  const addSubject = () => {
    if (!newSubject.id || !newSubject.name) {
      toast({
        title: "Error",
        description: "Please enter both subject ID and name",
        variant: "destructive",
      })
      return
    }

    if (subjects.some((s) => s.id === newSubject.id)) {
      toast({
        title: "Error",
        description: "Subject ID already exists",
        variant: "destructive",
      })
      return
    }

    setSubjects([...subjects, newSubject])
    setNewSubject({ id: "", name: "" })
    toast({
      title: "Success",
      description: "Subject added successfully",
    })
  }

  // Add or update grade
  const addGrade = () => {
    if (!newGrade.studentId || !newGrade.subjectId || newGrade.grade < 0 || newGrade.grade > 100) {
      toast({
        title: "Error",
        description: "Please enter valid student, subject, and grade (0-100)",
        variant: "destructive",
      })
      return
    }

    const existingGradeIndex = grades.findIndex(
      (g) => g.studentId === newGrade.studentId && g.subjectId === newGrade.subjectId,
    )

    if (existingGradeIndex >= 0) {
      const updatedGrades = [...grades]
      updatedGrades[existingGradeIndex] = newGrade
      setGrades(updatedGrades)
      toast({
        title: "Success",
        description: "Grade updated successfully",
      })
    } else {
      setGrades([...grades, newGrade])
      toast({
        title: "Success",
        description: "Grade added successfully",
      })
    }

    setNewGrade({ studentId: "", subjectId: "", grade: 0 })
  }

  // Delete student and their grades
  const deleteStudent = (id: string) => {
    setStudents(students.filter((s) => s.id !== id))
    setGrades(grades.filter((g) => g.studentId !== id))
    toast({
      title: "Success",
      description: "Student and associated grades deleted",
    })
  }

  // Delete subject and associated grades
  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id))
    setGrades(grades.filter((g) => g.subjectId !== id))
    toast({
      title: "Success",
      description: "Subject and associated grades deleted",
    })
  }

  // Get student data with grades
  const getStudentsWithGrades = (): StudentWithGrades[] => {
    return students.map((student) => {
      const studentGrades = grades
        .filter((g) => g.studentId === student.id)
        .map((g) => {
          const subject = subjects.find((s) => s.id === g.subjectId)
          return {
            subjectId: g.subjectId,
            subjectName: subject ? subject.name : g.subjectId,
            grade: g.grade,
          }
        })

      return {
        ...student,
        grades: studentGrades,
      }
    })
  }

  // Generate AI analysis
  const generateAnalysis = async () => {
    setIsAnalyzing(true)

    try {
      // Prepare data for analysis
      const studentsWithGrades = getStudentsWithGrades()
      const analysisData = {
        students: studentsWithGrades,
        subjects: subjects,
      }

      // In a real application, this would call the Ollama API
      // For this demo, we'll simulate the API call
      const response = await simulateOllamaAnalysis(analysisData)
      setAiAnalysis(response)
    } catch (error) {
      console.error("Error generating analysis:", error)
      toast({
        title: "Error",
        description: "Failed to generate analysis. Please try again.",
        variant: "destructive",
      })
      setAiAnalysis("Error generating analysis. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Simulate Ollama API call
  const simulateOllamaAnalysis = async (data: any): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Extract data
    const { students } = data

    // Calculate passing grade (70 or above)
    const passingGrade = 70

    // Find students at risk (average below passing)
    const studentsAtRisk = students.filter((student) => {
      if (student.grades.length === 0) return false
      const avgGrade = student.grades.reduce((sum, g) => sum + g.grade, 0) / student.grades.length
      return avgGrade < passingGrade
    })

    // Find lowest performing student
    let lowestAvgStudent = null
    let lowestAvg = 101 // Higher than possible

    students.forEach((student) => {
      if (student.grades.length === 0) return
      const avgGrade = student.grades.reduce((sum, g) => sum + g.grade, 0) / student.grades.length
      if (avgGrade < lowestAvg) {
        lowestAvg = avgGrade
        lowestAvgStudent = student
      }
    })

    // Find highest performing student
    let highestAvgStudent = null
    let highestAvg = -1

    students.forEach((student) => {
      if (student.grades.length === 0) return
      const avgGrade = student.grades.reduce((sum, g) => sum + g.grade, 0) / student.grades.length
      if (avgGrade > highestAvg) {
        highestAvg = avgGrade
        highestAvgStudent = student
      }
    })

    // Generate analysis text
    let analysis = "# Grade Analysis Summary\n\n"

    // Overall class performance
    const allGrades = students.flatMap((s) => s.grades.map((g) => g.grade))
    const classAvg =
      allGrades.length > 0 ? (allGrades.reduce((sum, g) => sum + g, 0) / allGrades.length).toFixed(1) : "N/A"

    analysis += `## Overall Performance\n`
    analysis += `- Class average: ${classAvg}%\n`
    analysis += `- Total students: ${students.length}\n`
    analysis += `- Students at risk of failing: ${studentsAtRisk.length}\n\n`

    // Individual insights
    analysis += `## Key Insights\n`

    if (lowestAvgStudent) {
      const avgGrade = (
        lowestAvgStudent.grades.reduce((sum, g) => sum + g.grade, 0) / lowestAvgStudent.grades.length
      ).toFixed(1)
      analysis += `- ${lowestAvgStudent.name} has the lowest average grade (${avgGrade}%) and needs additional support.\n`
    }

    if (highestAvgStudent) {
      const avgGrade = (
        highestAvgStudent.grades.reduce((sum, g) => sum + g.grade, 0) / highestAvgStudent.grades.length
      ).toFixed(1)
      analysis += `- ${highestAvgStudent.name} has the highest average grade (${avgGrade}%) and is excelling in their studies.\n`
    }

    if (studentsAtRisk.length > 0) {
      analysis += `- ${studentsAtRisk.length} student(s) are at risk of failing and require intervention:\n`
      studentsAtRisk.forEach((student) => {
        const avgGrade = (student.grades.reduce((sum, g) => sum + g.grade, 0) / student.grades.length).toFixed(1)
        analysis += `  * ${student.name} (Average: ${avgGrade}%)\n`
      })
    } else {
      analysis += `- All students are currently passing with grades above ${passingGrade}%.\n`
    }

    // Subject-specific insights
    analysis += `\n## Subject-Specific Insights\n`

    data.subjects.forEach((subject) => {
      const subjectGrades = students.flatMap((s) =>
        s.grades.filter((g) => g.subjectId === subject.id).map((g) => g.grade),
      )

      if (subjectGrades.length > 0) {
        const subjectAvg = (subjectGrades.reduce((sum, g) => sum + g, 0) / subjectGrades.length).toFixed(1)
        analysis += `- ${subject.name}: Average grade is ${subjectAvg}%\n`
      }
    })

    // Recommendations
    analysis += `\n## Recommendations\n`

    if (studentsAtRisk.length > 0) {
      analysis += `- Schedule additional tutoring sessions for students at risk of failing.\n`
      analysis += `- Consider parent-teacher conferences for students with consistently low performance.\n`
    }

    analysis += `- Continue to monitor student progress and provide timely feedback.\n`
    analysis += `- Recognize and reward high-performing students to maintain motivation.\n`

    return analysis
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Student Grade Analysis Platform</h1>
          <p className="text-muted-foreground">
            Input student grades and get AI-powered insights to improve academic performance
          </p>
          <Separator className="my-4" />
        </header>

        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Management
                  </CardTitle>
                  <CardDescription>Add and manage student records</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        placeholder="e.g., S001"
                        value={newStudent.id}
                        onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input
                        id="studentName"
                        placeholder="e.g., John Doe"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={addStudent} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </CardFooter>
              </Card>

              {/* Subject Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Subject Management
                  </CardTitle>
                  <CardDescription>Add and manage subject records</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subjectId">Subject ID</Label>
                      <Input
                        id="subjectId"
                        placeholder="e.g., MATH101"
                        value={newSubject.id}
                        onChange={(e) => setNewSubject({ ...newSubject, id: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subjectName">Subject Name</Label>
                      <Input
                        id="subjectName"
                        placeholder="e.g., Mathematics"
                        value={newSubject.name}
                        onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={addSubject} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Subject
                  </Button>
                </CardFooter>
              </Card>

              {/* Grade Management */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Grade Management
                  </CardTitle>
                  <CardDescription>Add and update student grades</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gradeStudentId">Student</Label>
                      <select
                        id="gradeStudentId"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newGrade.studentId}
                        onChange={(e) => setNewGrade({ ...newGrade, studentId: e.target.value })}
                      >
                        <option value="">Select Student</option>
                        {students.map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.name} ({student.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeSubjectId">Subject</Label>
                      <select
                        id="gradeSubjectId"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newGrade.subjectId}
                        onChange={(e) => setNewGrade({ ...newGrade, subjectId: e.target.value })}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name} ({subject.id})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradeValue">Grade (0-100)</Label>
                      <Input
                        id="gradeValue"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="e.g., 85"
                        value={newGrade.grade}
                        onChange={(e) => setNewGrade({ ...newGrade, grade: Number.parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={addGrade} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add/Update Grade
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Students Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Students</CardTitle>
                  <CardDescription>List of all students</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            No students added yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => deleteStudent(student.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Subjects Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Subjects</CardTitle>
                  <CardDescription>List of all subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            No subjects added yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        subjects.map((subject) => (
                          <TableRow key={subject.id}>
                            <TableCell>{subject.id}</TableCell>
                            <TableCell>{subject.name}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => deleteSubject(subject.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Grades Table */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Grades</CardTitle>
                  <CardDescription>All student grades by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Grade</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            No grades added yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        grades.map((grade, index) => {
                          const student = students.find((s) => s.id === grade.studentId)
                          const subject = subjects.find((s) => s.id === grade.subjectId)
                          return (
                            <TableRow key={index}>
                              <TableCell>{student ? student.name : grade.studentId}</TableCell>
                              <TableCell>{subject ? subject.name : grade.subjectId}</TableCell>
                              <TableCell className="text-right">
                                {grade.grade}
                                {grade.grade >= 70 ? (
                                  <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                ) : (
                                  <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  AI-Powered Grade Analysis
                </CardTitle>
                <CardDescription>Get insights and recommendations based on student performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button onClick={generateAnalysis} disabled={isAnalyzing || grades.length === 0}>
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Generate Analysis
                      </>
                    )}
                  </Button>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  {!aiAnalysis && !isAnalyzing ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <GraduationCap className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No Analysis Generated Yet</h3>
                      <p>Click the "Generate Analysis" button to get AI insights on student performance.</p>
                    </div>
                  ) : isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <RefreshCw className="h-12 w-12 animate-spin mb-4" />
                      <p className="text-lg font-medium">Analyzing student data...</p>
                      <p className="text-muted-foreground mt-2">This may take a moment</p>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {aiAnalysis.split("\n").map((line, index) => {
                        if (line.startsWith("# ")) {
                          return (
                            <h1 key={index} className="text-2xl font-bold mt-0 mb-4">
                              {line.substring(2)}
                            </h1>
                          )
                        } else if (line.startsWith("## ")) {
                          return (
                            <h2 key={index} className="text-xl font-semibold mt-6 mb-3">
                              {line.substring(3)}
                            </h2>
                          )
                        } else if (line.startsWith("- ")) {
                          return (
                            <p key={index} className="flex items-start mb-2">
                              <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary"></span>
                              <span>{line.substring(2)}</span>
                            </p>
                          )
                        } else if (line.startsWith("  * ")) {
                          return (
                            <p key={index} className="ml-6 flex items-start mb-2">
                              <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary"></span>
                              <span>{line.substring(4)}</span>
                            </p>
                          )
                        } else if (line === "") {
                          return <div key={index} className="my-2"></div>
                        } else {
                          return (
                            <p key={index} className="mb-2">
                              {line}
                            </p>
                          )
                        }
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
