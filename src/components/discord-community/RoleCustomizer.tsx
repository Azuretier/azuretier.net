import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Check, FloppyDisk } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/discord-community/ui/card'
import { Button } from '@/components/discord-community/ui/button'
import { Checkbox } from '@/components/discord-community/ui/checkbox'
import { Badge } from '@/components/discord-community/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/discord-community/ui/tabs'
import type { ServerRole } from '@/lib/discord-community/types'
import { toast } from 'sonner'

interface RoleCustomizerProps {
  availableRoles: ServerRole[]
  currentRoles: string[]
  onSave: (roles: string[]) => void
}

export function RoleCustomizer({ availableRoles, currentRoles, onSave }: RoleCustomizerProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles)
  const [hasChanges, setHasChanges] = useState(false)

  const categories = Array.from(new Set(availableRoles.map(r => r.category)))

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => {
      const newRoles = prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
      setHasChanges(true)
      return newRoles
    })
  }

  const handleSave = () => {
    onSave(selectedRoles)
    setHasChanges(false)
    toast.success('Roles Updated', {
      description: `${selectedRoles.length} role${selectedRoles.length !== 1 ? 's' : ''} selected`,
    })
  }

  const getRolesByCategory = (category: string) => {
    return availableRoles.filter(role => role.category === category)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" weight="fill" />
              </div>
              <div>
                <CardTitle className="text-2xl">Customize Your Roles</CardTitle>
                <CardDescription>
                  Select roles that represent your interests and contributions
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="font-mono">
              {selectedRoles.length} selected
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue={categories[0]} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category, catIndex) => (
              <TabsContent 
                key={category} 
                value={category}
                className="space-y-3 mt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getRolesByCategory(category).map((role, index) => {
                    const isSelected = selectedRoles.includes(role.id)
                    
                    return (
                      <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all border-2 ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => toggleRole(role.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleRole(role.id)}
                                className="mt-1"
                              />
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-card-foreground">
                                    {role.name}
                                  </h4>
                                  {isSelected && (
                                    <Check 
                                      className="h-4 w-4 text-primary ml-auto" 
                                      weight="bold"
                                    />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground leading-snug">
                                  {role.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end pt-4 border-t border-border"
            >
              <Button
                onClick={handleSave}
                size="lg"
                className="gap-2"
              >
                <FloppyDisk className="h-5 w-5" weight="fill" />
                Save Changes
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
