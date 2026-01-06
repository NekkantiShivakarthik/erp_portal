export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          school_id: string | null
          teacher_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          school_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          school_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          created_at: string | null
          id: string
          is_resolved: boolean | null
          message: string
          resolved_at: string | null
          school_id: string | null
          severity: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          message: string
          resolved_at?: string | null
          school_id?: string | null
          severity?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_resolved?: boolean | null
          message?: string
          resolved_at?: string | null
          school_id?: string | null
          severity?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alerts_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          class_id: string | null
          created_at: string | null
          date: string
          id: string
          status: string | null
          student_id: string | null
          teacher_id: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          status?: string | null
          student_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          status?: string | null
          student_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          grade: number | null
          id: string
          name: string
          school_id: string | null
          section: string | null
        }
        Insert: {
          created_at?: string | null
          grade?: number | null
          id?: string
          name: string
          school_id?: string | null
          section?: string | null
        }
        Update: {
          created_at?: string | null
          grade?: number | null
          id?: string
          name?: string
          school_id?: string | null
          section?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_transactions: {
        Row: {
          amount: number
          approved_by: string | null
          category: string | null
          created_at: string | null
          description: string
          fund_id: string | null
          id: string
          school_id: string | null
          status: string | null
          transaction_date: string | null
        }
        Insert: {
          amount: number
          approved_by?: string | null
          category?: string | null
          created_at?: string | null
          description: string
          fund_id?: string | null
          id?: string
          school_id?: string | null
          status?: string | null
          transaction_date?: string | null
        }
        Update: {
          amount?: number
          approved_by?: string | null
          category?: string | null
          created_at?: string | null
          description?: string
          fund_id?: string | null
          id?: string
          school_id?: string | null
          status?: string | null
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fund_transactions_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fund_transactions_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      funds: {
        Row: {
          allocated_amount: number | null
          category: string
          created_at: string | null
          financial_year: string | null
          id: string
          school_id: string | null
          updated_at: string | null
          utilized_amount: number | null
        }
        Insert: {
          allocated_amount?: number | null
          category: string
          created_at?: string | null
          financial_year?: string | null
          id?: string
          school_id?: string | null
          updated_at?: string | null
          utilized_amount?: number | null
        }
        Update: {
          allocated_amount?: number | null
          category?: string
          created_at?: string | null
          financial_year?: string | null
          id?: string
          school_id?: string | null
          updated_at?: string | null
          utilized_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "funds_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      infrastructure_issues: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          reported_by: string | null
          reported_date: string | null
          resolved_date: string | null
          school_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          reported_by?: string | null
          reported_date?: string | null
          resolved_date?: string | null
          school_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          reported_by?: string | null
          reported_date?: string | null
          resolved_date?: string | null
          school_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "infrastructure_issues_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "infrastructure_issues_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          address: string | null
          code: string
          created_at: string | null
          district: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          code: string
          created_at?: string | null
          district: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          code?: string
          created_at?: string | null
          district?: string
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          class_id: string | null
          created_at: string | null
          id: string
          name: string
          parent_phone: string | null
          password: string | null
          roll_no: string | null
          school_id: string | null
          updated_at: string | null
        }
        Insert: {
          class_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          parent_phone?: string | null
          password?: string | null
          roll_no?: string | null
          school_id?: string | null
          updated_at?: string | null
        }
        Update: {
          class_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          parent_phone?: string | null
          password?: string | null
          roll_no?: string | null
          school_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          teacher_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          teacher_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          teacher_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_tasks_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string | null
          email: string | null
          employee_id: string | null
          id: string
          name: string
          password: string | null
          phone: string | null
          role: string | null
          school_id: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          id?: string
          name: string
          password?: string | null
          phone?: string | null
          role?: string | null
          school_id?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          employee_id?: string | null
          id?: string
          name?: string
          password?: string | null
          phone?: string | null
          role?: string | null
          school_id?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never
