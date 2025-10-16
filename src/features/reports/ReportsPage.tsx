import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiFileText, 
  FiCheckCircle, 
  FiClock, 
  FiTag, 
  FiList,
  FiUsers,
  FiCpu,
  FiDownload,
  FiTrendingUp,
  FiAlertCircle
} from 'react-icons/fi';

// Styled Components
const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: white;
`;

const PageSubtitle = styled.p`
  margin: 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const ReportCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
`;

const CardValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #667eea;
  margin: 16px 0;
`;

const CardDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
`;

const DetailedSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const StatItem = styled.div`
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const StatLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled.div<{ percentage: number; color?: string }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => props.color || '#667eea'};
  transition: width 0.3s ease;
`;

const ChartContainer = styled.div`
  margin-top: 24px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 200px;
  padding: 20px 0;
`;

const Bar = styled.div<{ height: number; color?: string }>`
  flex: 1;
  background: ${props => props.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  height: ${props => props.height}%;
  border-radius: 8px 8px 0 0;
  transition: height 0.3s ease;
  position: relative;
  min-height: 20px;

  &:hover {
    opacity: 0.8;
  }
`;

const BarLabel = styled.div`
  text-align: center;
  font-size: 12px;
  color: #718096;
  margin-top: 8px;
  font-weight: 600;
`;

const BarValue = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 700;
  color: #2d3748;
  white-space: nowrap;
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
`;

const TagItem = styled.div<{ size: number }>`
  padding: ${props => 8 + props.size * 2}px ${props => 16 + props.size * 3}px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 24px;
  font-size: ${props => 12 + props.size * 2}px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
  font-size: 14px;
`;

const Badge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch(props.status) {
      case 'approved': return '#48bb78';
      case 'rejected': return '#f56565';
      case 'pending': return '#ed8936';
      default: return '#718096';
    }
  }};
  color: white;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #718096;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
`;

// Componente Principal
const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Dados simulados (substitua com dados reais da API)
  const documentsData = {
    total: 1247,
    active: 1198,
    inactive: 49,
    validated: 892,
    pending: 306,
    byPeriod: [
      { month: 'Jan', count: 98 },
      { month: 'Fev', count: 112 },
      { month: 'Mar', count: 135 },
      { month: 'Abr', count: 156 },
      { month: 'Mai', count: 178 },
      { month: 'Jun', count: 142 }
    ]
  };

  const validationsData = {
    total: 892,
    approved: 745,
    rejected: 89,
    returned: 58,
    approvalRate: 83.5,
    avgTime: '2.3 dias',
    topValidators: [
      { name: 'João Silva', count: 234 },
      { name: 'Maria Santos', count: 198 },
      { name: 'Pedro Costa', count: 167 }
    ]
  };

  const versionsData = {
    total: 3456,
    mostEdited: [
      { title: 'Manual de Onboarding', versions: 23 },
      { title: 'Política de Segurança', versions: 19 },
      { title: 'Processo de Vendas', versions: 17 }
    ]
  };

  const tagsData = {
    total: 45,
    topTags: [
      { name: 'Processo', count: 234, size: 3 },
      { name: 'Manual', count: 198, size: 2 },
      { name: 'Política', count: 167, size: 2 },
      { name: 'Treinamento', count: 145, size: 1 },
      { name: 'Financeiro', count: 123, size: 1 },
      { name: 'RH', count: 98, size: 0 }
    ]
  };

  const tasksData = {
    total: 456,
    completed: 289,
    pending: 134,
    overdue: 33,
    completionRate: 63.4,
    byPriority: {
      high: 67,
      medium: 245,
      low: 144
    }
  };

  const groupsData = {
    total: 23,
    members: 187,
    avgMembersPerGroup: 8.1,
    topGroups: [
      { name: 'Desenvolvimento', members: 34 },
      { name: 'Comercial', members: 28 },
      { name: 'Financeiro', members: 19 }
    ]
  };

  const aiData = {
    totalRequests: 2345,
    totalTokens: 1234567,
    avgTokensPerRequest: 526,
    topUsers: [
      { name: 'Ana Paula', requests: 234 },
      { name: 'Carlos Eduardo', requests: 198 },
      { name: 'Beatriz Lima', requests: 167 }
    ],
    estimatedCost: 'R$ 247,89'
  };

  const handleDownloadReport = () => {
    alert('Download do relatório iniciado!');
    // Implementar lógica de download aqui
  };

  const maxCount = Math.max(...documentsData.byPeriod.map(d => d.count));

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>📊 Relatórios e Análises</PageTitle>
        <PageSubtitle>Visualize insights e métricas do sistema Documentin</PageSubtitle>
      </PageHeader>

      {/* Cards de Resumo */}
      <ReportsGrid>
        <ReportCard onClick={() => setSelectedReport('documents')}>
          <CardHeader>
            <CardIcon><FiFileText /></CardIcon>
          </CardHeader>
          <CardTitle>Documentos</CardTitle>
          <CardValue>{documentsData.total}</CardValue>
          <CardDescription>
            {documentsData.active} ativos • {documentsData.validated} validados
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('validations')}>
          <CardHeader>
            <CardIcon><FiCheckCircle /></CardIcon>
          </CardHeader>
          <CardTitle>Validações</CardTitle>
          <CardValue>{validationsData.total}</CardValue>
          <CardDescription>
            Taxa de aprovação: {validationsData.approvalRate}%
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('versions')}>
          <CardHeader>
            <CardIcon><FiClock /></CardIcon>
          </CardHeader>
          <CardTitle>Versões</CardTitle>
          <CardValue>{versionsData.total}</CardValue>
          <CardDescription>
            Histórico completo de edições
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('tags')}>
          <CardHeader>
            <CardIcon><FiTag /></CardIcon>
          </CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardValue>{tagsData.total}</CardValue>
          <CardDescription>
            Sistema de categorização ativo
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('tasks')}>
          <CardHeader>
            <CardIcon><FiList /></CardIcon>
          </CardHeader>
          <CardTitle>Tarefas</CardTitle>
          <CardValue>{tasksData.total}</CardValue>
          <CardDescription>
            {tasksData.completed} concluídas • {tasksData.overdue} atrasadas
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('groups')}>
          <CardHeader>
            <CardIcon><FiUsers /></CardIcon>
          </CardHeader>
          <CardTitle>Grupos</CardTitle>
          <CardValue>{groupsData.total}</CardValue>
          <CardDescription>
            {groupsData.members} membros no total
          </CardDescription>
        </ReportCard>

        <ReportCard onClick={() => setSelectedReport('ai')}>
          <CardHeader>
            <CardIcon><FiCpu /></CardIcon>
          </CardHeader>
          <CardTitle>IA (OpenAI)</CardTitle>
          <CardValue>{aiData.totalRequests}</CardValue>
          <CardDescription>
            {aiData.totalTokens.toLocaleString()} tokens utilizados
          </CardDescription>
        </ReportCard>
      </ReportsGrid>

      {/* Relatório de Documentos */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiFileText /> Análise de Documentos
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> Exportar Relatório
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>Total de Documentos</StatLabel>
            <StatValue>{documentsData.total}</StatValue>
            <ProgressBar>
              <ProgressFill percentage={100} />
            </ProgressBar>
          </StatItem>
          <StatItem>
            <StatLabel>Documentos Ativos</StatLabel>
            <StatValue>{documentsData.active}</StatValue>
            <ProgressBar>
              <ProgressFill 
                percentage={(documentsData.active / documentsData.total) * 100} 
                color="#48bb78"
              />
            </ProgressBar>
          </StatItem>
          <StatItem>
            <StatLabel>Validados</StatLabel>
            <StatValue>{documentsData.validated}</StatValue>
            <ProgressBar>
              <ProgressFill 
                percentage={(documentsData.validated / documentsData.total) * 100} 
                color="#667eea"
              />
            </ProgressBar>
          </StatItem>
          <StatItem>
            <StatLabel>Pendentes</StatLabel>
            <StatValue>{documentsData.pending}</StatValue>
            <ProgressBar>
              <ProgressFill 
                percentage={(documentsData.pending / documentsData.total) * 100} 
                color="#ed8936"
              />
            </ProgressBar>
          </StatItem>
        </StatsGrid>

        <ChartContainer>
          <h3 style={{ margin: '0 0 20px 0', color: '#2d3748' }}>Documentos Criados por Mês</h3>
          <BarChart>
            {documentsData.byPeriod.map((item, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Bar height={(item.count / maxCount) * 100}>
                  <BarValue>{item.count}</BarValue>
                </Bar>
                <BarLabel>{item.month}</BarLabel>
              </div>
            ))}
          </BarChart>
        </ChartContainer>
      </DetailedSection>

      {/* Relatório de Validações */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiCheckCircle /> Análise de Validações
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> Exportar Relatório
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>Taxa de Aprovação</StatLabel>
            <StatValue>{validationsData.approvalRate}%</StatValue>
            <ProgressBar>
              <ProgressFill percentage={validationsData.approvalRate} color="#48bb78" />
            </ProgressBar>
          </StatItem>
          <StatItem>
            <StatLabel>Aprovados</StatLabel>
            <StatValue>{validationsData.approved}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Rejeitados</StatLabel>
            <StatValue>{validationsData.rejected}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Tempo Médio</StatLabel>
            <StatValue>{validationsData.avgTime}</StatValue>
          </StatItem>
        </StatsGrid>

        <h3 style={{ marginTop: '32px', marginBottom: '16px', color: '#2d3748' }}>
          Top Validadores
        </h3>
        <Table>
          <thead>
            <tr>
              <Th>Validador</Th>
              <Th>Validações</Th>
              <Th>Desempenho</Th>
            </tr>
          </thead>
          <tbody>
            {validationsData.topValidators.map((validator, index) => (
              <tr key={index}>
                <Td>{validator.name}</Td>
                <Td><strong>{validator.count}</strong></Td>
                <Td>
                  <ProgressBar>
                    <ProgressFill 
                      percentage={(validator.count / validationsData.topValidators[0].count) * 100} 
                      color="#667eea"
                    />
                  </ProgressBar>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </DetailedSection>

      {/* Relatório de Versões */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiClock /> Histórico de Versões
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> Exportar Relatório
          </DownloadButton>
        </SectionHeader>

        <StatItem>
          <StatLabel>Total de Versões Criadas</StatLabel>
          <StatValue>{versionsData.total}</StatValue>
        </StatItem>

        <h3 style={{ marginTop: '32px', marginBottom: '16px', color: '#2d3748' }}>
          Documentos Mais Editados
        </h3>
        <Table>
          <thead>
            <tr>
              <Th>Documento</Th>
              <Th>Nº de Versões</Th>
              <Th>Atividade</Th>
            </tr>
          </thead>
          <tbody>
            {versionsData.mostEdited.map((doc, index) => (
              <tr key={index}>
                <Td>{doc.title}</Td>
                <Td><strong>{doc.versions}</strong></Td>
                <Td>
                  <ProgressBar>
                    <ProgressFill 
                      percentage={(doc.versions / versionsData.mostEdited[0].versions) * 100} 
                      color="#764ba2"
                    />
                  </ProgressBar>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </DetailedSection>

      {/* Relatório de Tags */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiTag /> Análise de Tags
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> Exportar Relatório
          </DownloadButton>
        </SectionHeader>

        <StatItem>
          <StatLabel>Total de Tags</StatLabel>
          <StatValue>{tagsData.total}</StatValue>
        </StatItem>

        <h3 style={{ marginTop: '32px', marginBottom: '8px', color: '#2d3748' }}>
          Tags Mais Utilizadas
        </h3>
        <TagCloud>
          {tagsData.topTags.map((tag, index) => (
            <TagItem key={index} size={tag.size}>
              {tag.name} ({tag.count})
            </TagItem>
          ))}
        </TagCloud>
      </DetailedSection>

      {/* Relatório de Tarefas */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiList /> Análise de Tarefas
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> Exportar Relatório
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>Taxa de Conclusão</StatLabel>
            <StatValue>{tasksData.completionRate}%</StatValue>
            <ProgressBar>
              <ProgressFill percentage={tasksData.completionRate} color="#48bb78" />
            </ProgressBar>
          </StatItem>
          <StatItem>
            <StatLabel>Concluídas</StatLabel>
            <StatValue>{tasksData.completed}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Pendentes</StatLabel>
            <StatValue>{tasksData.pending}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>
              <FiAlertCircle style={{ display: 'inline', marginRight: '4px' }} />
              Atrasadas
            </StatLabel>
            <StatValue style={{ color: '#f56565' }}>{tasksData.overdue}</StatValue>
          </StatItem>
        </StatsGrid>

        <ChartContainer>
          <h3 style={{ margin: '0 0 20px 0', color: '#2d3748' }}>Tarefas por Prioridade</h3>
          <StatsGrid>
            <StatItem>
              <StatLabel>Alta Prioridade</StatLabel>
              <StatValue>{tasksData.byPriority.high}</StatValue>
              <ProgressBar>
                <ProgressFill 
                  percentage={(tasksData.byPriority.high / tasksData.total) * 100} 
                  color="#f56565"
                />
              </ProgressBar>
            </StatItem>
            <StatItem>
              <StatLabel>Média Prioridade</StatLabel>
              <StatValue>{tasksData.byPriority.medium}</StatValue>
              <ProgressBar>
                <ProgressFill 
                  percentage={(tasksData.byPriority.medium / tasksData.total) * 100} 
                  color="#ed8936"
                />
              </ProgressBar>
            </StatItem>
            <StatItem>
              <StatLabel>Baixa Prioridade</StatLabel>
              <StatValue>{tasksData.byPriority.low}</StatValue>
              <ProgressBar>
                <ProgressFill 
                  percentage={(tasksData.byPriority.low / tasksData.total) * 100} 
                  color="#48bb78"
                />
              </ProgressBar>
            </StatItem>
          </StatsGrid>
        </ChartContainer>
      </DetailedSection>

      {/* Relatório de Grupos */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiUsers /> Análise de Grupos
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> Exportar Relatório
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>Total de Grupos</StatLabel>
            <StatValue>{groupsData.total}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Total de Membros</StatLabel>
            <StatValue>{groupsData.members}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Média por Grupo</StatLabel>
            <StatValue>{groupsData.avgMembersPerGroup}</StatValue>
          </StatItem>
        </StatsGrid>

        <h3 style={{ marginTop: '32px', marginBottom: '16px', color: '#2d3748' }}>
          Grupos Mais Populosos
        </h3>
        <Table>
          <thead>
            <tr>
              <Th>Grupo</Th>
              <Th>Membros</Th>
              <Th>Distribuição</Th>
            </tr>
          </thead>
          <tbody>
            {groupsData.topGroups.map((group, index) => (
              <tr key={index}>
                <Td>{group.name}</Td>
                <Td><strong>{group.members}</strong></Td>
                <Td>
                  <ProgressBar>
                    <ProgressFill 
                      percentage={(group.members / groupsData.topGroups[0].members) * 100} 
                      color="#667eea"
                    />
                  </ProgressBar>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </DetailedSection>

      {/* Relatório de IA */}
      <DetailedSection>
        <SectionHeader>
          <SectionTitle>
            <FiCpu /> Análise de Uso de IA
          </SectionTitle>
          <DownloadButton onClick={handleDownloadReport}>
            <FiDownload /> Exportar Relatório
          </DownloadButton>
        </SectionHeader>

        <StatsGrid>
          <StatItem>
            <StatLabel>Total de Requisições</StatLabel>
            <StatValue>{aiData.totalRequests}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Tokens Utilizados</StatLabel>
            <StatValue>{aiData.totalTokens.toLocaleString()}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Média por Requisição</StatLabel>
            <StatValue>{aiData.avgTokensPerRequest}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Custo Estimado</StatLabel>
            <StatValue style={{ color: '#48bb78' }}>{aiData.estimatedCost}</StatValue>
          </StatItem>
        </StatsGrid>

        <h3 style={{ marginTop: '32px', marginBottom: '16px', color: '#2d3748' }}>
          Usuários com Mais Requisições
        </h3>
        <Table>
          <thead>
            <tr>
              <Th>Usuário</Th>
              <Th>Requisições</Th>
              <Th>Uso</Th>
            </tr>
          </thead>
          <tbody>
            {aiData.topUsers.map((user, index) => (
              <tr key={index}>
                <Td>{user.name}</Td>
                <Td><strong>{user.requests}</strong></Td>
                <Td>
                  <ProgressBar>
                    <ProgressFill 
                      percentage={(user.requests / aiData.topUsers[0].requests) * 100} 
                      color="#667eea"
                    />
                  </ProgressBar>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </DetailedSection>
    </PageContainer>
  );
};

export default ReportsPage;