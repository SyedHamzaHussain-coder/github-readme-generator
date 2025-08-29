import React, { useState, useCallback } from 'react';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult,
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot
} from 'react-beautiful-dnd';
import { Plus, GripVertical, Edit3, Trash2, Eye, Code, Save } from 'lucide-react';
import { LivePreview } from './LivePreview';

export interface ReadmeSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  order: number;
  editable: boolean;
  required: boolean;
  customContent?: string;
}

export type SectionType = 
  | 'title' | 'description' | 'badges' | 'installation' 
  | 'usage' | 'api' | 'features' | 'screenshots' 
  | 'contributing' | 'license' | 'acknowledgments'
  | 'custom' | 'tech-stack' | 'roadmap' | 'changelog';

interface VisualBuilderProps {
  initialSections: ReadmeSection[];
  onSectionsChange: (sections: ReadmeSection[]) => void;
  onPreview: (markdown: string) => void;
  repositoryData?: any;
}

const SECTION_TEMPLATES: Record<SectionType, { title: string; content: string; icon: string }> = {
  title: {
    title: 'Project Title',
    content: '# {{projectName}}\n\n{{description}}',
    icon: '📝'
  },
  description: {
    title: 'Description',
    content: '## Description\n\n{{description}}',
    icon: '📖'
  },
  badges: {
    title: 'Badges',
    content: '![Build Status]({{buildBadge}})\n![License]({{licenseBadge}})\n![Version]({{versionBadge}})',
    icon: '🏷️'
  },
  installation: {
    title: 'Installation',
    content: '## Installation\n\n```bash\n{{installCommand}}\n```',
    icon: '⚡'
  },
  usage: {
    title: 'Usage',
    content: '## Usage\n\n```{{language}}\n{{usageExample}}\n```',
    icon: '🚀'
  },
  api: {
    title: 'API Reference',
    content: '## API Reference\n\n### Endpoints\n\n{{apiEndpoints}}',
    icon: '🔌'
  },
  features: {
    title: 'Features',
    content: '## Features\n\n- ✨ Feature 1\n- 🚀 Feature 2\n- 🎯 Feature 3',
    icon: '✨'
  },
  screenshots: {
    title: 'Screenshots',
    content: '## Screenshots\n\n![App Screenshot]({{screenshotUrl}})',
    icon: '📸'
  },
  contributing: {
    title: 'Contributing',
    content: '## Contributing\n\nContributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md).',
    icon: '🤝'
  },
  license: {
    title: 'License',
    content: '## License\n\nThis project is licensed under the {{license}} License - see the [LICENSE](LICENSE) file for details.',
    icon: '📄'
  },
  acknowledgments: {
    title: 'Acknowledgments',
    content: '## Acknowledgments\n\n- Thanks to all contributors\n- Inspired by amazing open source projects',
    icon: '🙏'
  },
  custom: {
    title: 'Custom Section',
    content: '## Custom Section\n\nAdd your custom content here.',
    icon: '✏️'
  },
  'tech-stack': {
    title: 'Tech Stack',
    content: '## Tech Stack\n\n**Client:** {{clientTech}}\n\n**Server:** {{serverTech}}',
    icon: '🛠️'
  },
  roadmap: {
    title: 'Roadmap',
    content: '## Roadmap\n\n- [x] Phase 1: Core Features\n- [ ] Phase 2: Advanced Features\n- [ ] Phase 3: Performance Optimization',
    icon: '🗺️'
  },
  changelog: {
    title: 'Changelog',
    content: '## Changelog\n\n### [1.0.0] - 2024-01-01\n- Initial release',
    icon: '📋'
  }
};

export const VisualBuilder: React.FC<VisualBuilderProps> = ({
  initialSections,
  onSectionsChange,
  onPreview,
  repositoryData
}) => {
  const [sections, setSections] = useState<ReadmeSection[]>(initialSections);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const newSections = Array.from(sections);
    const [reorderedSection] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedSection);

    // Update order
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index
    }));

    setSections(updatedSections);
    onSectionsChange(updatedSections);
  }, [sections, onSectionsChange]);

  const addSection = useCallback((type: SectionType) => {
    const template = SECTION_TEMPLATES[type];
    const newSection: ReadmeSection = {
      id: `section-${Date.now()}`,
      type,
      title: template.title,
      content: template.content,
      order: sections.length,
      editable: true,
      required: false
    };

    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    onSectionsChange(updatedSections);
    setShowSectionLibrary(false);
  }, [sections, onSectionsChange]);

  const updateSection = useCallback((id: string, updates: Partial<ReadmeSection>) => {
    const updatedSections = sections.map(section =>
      section.id === id ? { ...section, ...updates } : section
    );
    setSections(updatedSections);
    onSectionsChange(updatedSections);
  }, [sections, onSectionsChange]);

  const deleteSection = useCallback((id: string) => {
    const updatedSections = sections.filter(section => section.id !== id);
    setSections(updatedSections);
    onSectionsChange(updatedSections);
  }, [sections, onSectionsChange]);

  const generateMarkdown = useCallback(() => {
    return sections
      .sort((a, b) => a.order - b.order)
      .map(section => section.customContent || section.content)
      .join('\n\n');
  }, [sections]);

  const handlePreview = useCallback(() => {
    const markdown = generateMarkdown();
    onPreview(markdown);
    setPreviewMode(!previewMode);
  }, [generateMarkdown, onPreview, previewMode]);

  return (
    <div className="visual-builder p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">README Visual Builder</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSectionLibrary(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Section
            </button>
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {previewMode ? <Code size={20} /> : <Eye size={20} />}
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Builder / Preview */}
        <div className="lg:col-span-2">
          {previewMode ? (
            <LivePreview markdown={generateMarkdown()} />
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided: DroppableProvided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {sections.map((section, index) => (
                      <Draggable
                        key={section.id}
                        draggableId={section.id}
                        index={index}
                      >
                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                              snapshot.isDragging
                                ? 'border-blue-400 shadow-lg'
                                : 'border-gray-200'
                            }`}
                          >
                            <SectionEditor
                              section={section}
                              isEditing={editingSection === section.id}
                              onEdit={() => setEditingSection(section.id)}
                              onSave={() => setEditingSection(null)}
                              onUpdate={(updates) => updateSection(section.id, updates)}
                              onDelete={() => deleteSection(section.id)}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Section Library */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Section Library</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(SECTION_TEMPLATES).map(([type, template]) => (
                <button
                  key={type}
                  onClick={() => addSection(type as SectionType)}
                  className="flex items-center gap-2 p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span>{template.icon}</span>
                  <span className="truncate">{template.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* README Stats */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">README Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Sections:</span>
                <span className="font-medium">{sections.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Words:</span>
                <span className="font-medium">
                  {generateMarkdown().split(' ').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Characters:</span>
                <span className="font-medium">
                  {generateMarkdown().length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                🤖 AI Enhance
              </button>
              <button className="w-full p-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                📊 Add Analytics
              </button>
              <button className="w-full p-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                🎨 Style Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Library Modal */}
      {showSectionLibrary && (
        <SectionLibraryModal
          onAddSection={addSection}
          onClose={() => setShowSectionLibrary(false)}
        />
      )}
    </div>
  );
};

interface SectionEditorProps {
  section: ReadmeSection;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onUpdate: (updates: Partial<ReadmeSection>) => void;
  onDelete: () => void;
  dragHandleProps: any;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  isEditing,
  onEdit,
  onSave,
  onUpdate,
  onDelete,
  dragHandleProps
}) => {
  const [localContent, setLocalContent] = useState(section.customContent || section.content);
  const [localTitle, setLocalTitle] = useState(section.title);

  const handleSave = () => {
    onUpdate({
      title: localTitle,
      customContent: localContent
    });
    onSave();
  };

  return (
    <div className="p-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            {...dragHandleProps}
            className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={20} />
          </div>
          <span className="text-xl">
            {SECTION_TEMPLATES[section.type]?.icon}
          </span>
          {isEditing ? (
            <input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="text-lg font-semibold bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <h3 className="text-lg font-semibold">{section.title}</h3>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Save size={16} />
            </button>
          ) : (
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 size={16} />
            </button>
          )}
          {!section.required && (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Section Content */}
      {isEditing ? (
        <textarea
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter markdown content..."
        />
      ) : (
        <div className="bg-gray-50 p-3 rounded-lg">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
            {section.customContent || section.content}
          </pre>
        </div>
      )}
    </div>
  );
};

interface SectionLibraryModalProps {
  onAddSection: (type: SectionType) => void;
  onClose: () => void;
}

const SectionLibraryModal: React.FC<SectionLibraryModalProps> = ({
  onAddSection,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full m-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Add Section</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(SECTION_TEMPLATES).map(([type, template]) => (
            <button
              key={type}
              onClick={() => onAddSection(type as SectionType)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{template.icon}</span>
                <h4 className="font-semibold">{template.title}</h4>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                {template.content.substring(0, 100)}...
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualBuilder;
